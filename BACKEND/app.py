import os
os.environ['CUDA_VISIBLE_DEVICES'] = '0'  # Keep GPU visible for PyTorch
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

#import os
#os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # Force everything CPU

#import os
#os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import warnings
warnings.filterwarnings('ignore')

import logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)
logging.getLogger('tensorflow_hub').setLevel(logging.ERROR)

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import jwt
from jwt import PyJWKClient
from werkzeug.utils import secure_filename
import threading
import json
import uuid
import shutil
import redis
from models.yamnet_classifier import YAMNetClassifier
from utils.rate_limiter import RateLimiter
from celery_app import celery_app, process_music_task, process_speech_task

from supabase import create_client, Client

app = Flask(__name__)
# Restrict CORS to specific frontend origins to prevent unauthorized access
CORS(app, origins=["http://localhost:5173", "https://jexy.me", "https://www.jexy.me", "http://localhost:5174"])

# Cache for JWK clients keyed by issuer URL to avoid creating too many clients
jwks_clients = {}

def get_user_id_from_request():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        # 1. Decode unverified to get the issuer
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        issuer = unverified_payload.get('iss')
        
        if not issuer:
            app.logger.error("JWT Verification failed: Missing issuer")
            return None
            
        # VERY IMPORTANT: Verify the issuer matches our expected Clerk instance!
        expected_issuer = os.environ.get('CLERK_ISSUER')
        if expected_issuer and issuer != expected_issuer:
            app.logger.error(f"JWT Verification failed: Invalid issuer {issuer}")
            return None
            
        # 2. Get or create a PyJWKClient for this issuer
        jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
        if jwks_url not in jwks_clients:
            jwks_clients[jwks_url] = PyJWKClient(jwks_url)
            
        jwks_client = jwks_clients[jwks_url]
        
        # 3. Get the signing key and verify
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        return data.get("sub")
    except Exception as e:
        app.logger.error(f"JWT Verification failed: {e}")
        return None

# Initialize Supabase client
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Initialize Redis client (shared state across Gunicorn workers)
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
redis_client = redis.Redis.from_url(REDIS_URL)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DIR = os.path.join(BASE_DIR, 'processed')

# Initialize models — only YAMNet needed in the web server (lightweight classifier)
# Demucs, Whisper, DeepFilterNet now load inside the Celery worker process only
yamnet_classifier = YAMNetClassifier()  #Google YAMNet classifier 



# Initialize rate limiter (limits to max 5 uploads per minute)
rate_limiter = RateLimiter(max_requests=5, time_window=60)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac', 'm4a'}

# Create folders
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('processed', exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#  ROUTES 

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to Jexy API",
        "version": "2.0.0",
        "status": "running"
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

# UPLOAD & AUTO-CLASSIFY 

@app.route('/api/upload', methods=['POST'])
def upload_audio():
    """
    STAGE 1: Upload file and classify with YAMNet
    Returns classification for user confirmation
    """
    # Rate limiting check
    client_ip = request.remote_addr
    allowed, remaining, reset_time = rate_limiter.is_allowed(client_ip)
    
    if not allowed:
        return jsonify({
            "error": "Rate limit exceeded",
            "message": f"Too many uploads. Please wait {reset_time} seconds.",
            "retry_after": reset_time
        }), 429  # HTTP 429, i.e Too Many Requests
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        try:
            # Classify with the YAMNet model 
            result = yamnet_classifier.classify(filepath)
            
            if result is None:
                return jsonify({
                    "error": "Failed to classify audio",
                    "filename": filename,
                    "suggestion": "Please specify if this is music or speech"
                }), 500
            
            # Store file info in Redis with 1-hour TTL (shared across all Gunicorn workers)
            redis_client.setex(f"upload:{file_id}", 3600, json.dumps({
                "filename": filename,
                "filepath": filepath,
                "detected_type": result['classification'],
                "confidence": result['confidence'],
                "top_predictions": result['top_predictions']
            }))
            
            return jsonify({
                "file_id": file_id,
                "filename": filename,
                "detected_type": result['classification'],
                "confidence": result['confidence'],
                "top_predictions": result['top_predictions'],
                "status": "awaiting_confirmation",
                "message": f"AI detected this as {result['classification'].upper()} with {result['confidence']:.0f}% confidence"
            }), 200
            
        except Exception as e:
            return jsonify({
                "error": f"Classification failed: {str(e)}",
                "filename": filename
            }), 500
    
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/process/<file_id>', methods=['POST'])
def confirm_and_process(file_id):
    """
    STAGE 2: User confirms content type and starts processing via Celery
    """
    # Look up file info from Redis (instead of in-memory dict)
    file_info_raw = redis_client.get(f"upload:{file_id}")
    if not file_info_raw:
        return jsonify({"error": "File ID not found or expired"}), 404
    
    file_info = json.loads(file_info_raw)
    
    # Get user's confirmed content type (or use detected)
    data = request.get_json() or {}
    content_type = data.get('content_type', file_info['detected_type'])
    
    if content_type not in ['music', 'speech']:
        return jsonify({"error": "Invalid content type"}), 400
    
    # Generate processing job ID
    job_id = str(uuid.uuid4())

    # Get user_id from verified JWT
    user_id = get_user_id_from_request()

    # Save job record to Supabase
    try:
        from datetime import datetime, timezone
        supabase.table('jobs').insert({
            'id': job_id,
            'filename': file_info['filename'],
            'job_type': content_type,
            'status': 'processing',
            'user_id': user_id,
            'created_at': datetime.now(timezone.utc).isoformat()
        }).execute()
    except Exception as e:
        app.logger.error(f"Supabase insert failed for job {job_id}: {e}")

    # Dispatch processing to Celery worker (returns immediately)
    if content_type == "music":
        task = process_music_task.delay(file_info['filepath'], job_id)
        
        return jsonify({
            "job_id": job_id,
            "file_id": file_id,
            "filename": file_info['filename'],
            "content_type": "music",
            "status": "processing",
            "message": "Music processing started",
            "check_status_url": f"/api/process/music/{job_id}/status",
            "estimated_time": "-"
        }), 200
        
    elif content_type == "speech":
        task = process_speech_task.delay(file_info['filepath'], job_id)
        
        return jsonify({
            "job_id": job_id,
            "file_id": file_id,
            "filename": file_info['filename'],
            "content_type": "speech",
            "status": "processing",
            "message": "Speech processing started",
            "check_status_url": f"/api/process/speech/{job_id}/status",
            "estimated_time": "-"
        }), 200

# MUSIC PROCESSING route

@app.route('/api/process/music/<job_id>/status', methods=['GET'])
def get_music_status(job_id):
    """Check status of music processing job"""
    # Return cancelled status gracefully if the job was cancelled
    if redis_client.sismember('cancelled_jobs', job_id):
        return jsonify({"status": "cancelled", "job_id": job_id}), 200

    # Check Supabase for the job's current status
    try:
        result = supabase.table('jobs').select('status').eq('id', job_id).execute()
        if result.data:
            db_status = result.data[0]['status']
            if db_status == 'completed':
                return jsonify({
                    "status": "completed",
                    "job_id": job_id,
                    "message": "Processing complete"
                }), 200
            elif db_status == 'failed':
                return jsonify({
                    "status": "failed",
                    "job_id": job_id,
                    "error": "Processing failed"
                }), 200
    except Exception as e:
        app.logger.error(f"Supabase status check failed for job {job_id}: {e}")

    # Check Celery task state for progress
    celery_task_id = redis_client.get(f"celery_task:{job_id}")
    if celery_task_id:
        celery_task_id = celery_task_id.decode('utf-8')
        task_result = celery_app.AsyncResult(celery_task_id)
        
        if task_result.state == 'STARTED' or task_result.state == 'PENDING':
            # Check for progress stored by the processor
            progress_raw = redis_client.get(f"progress:{job_id}")
            response = {
                "status": "processing",
                "job_id": job_id,
                "message": "Processing audio..."
            }
            if progress_raw:
                progress_info = json.loads(progress_raw)
                response["progress"] = progress_info.get("percent", 0)
                response["current_step"] = progress_info.get("message", "Processing...")
                response["updated_at"] = progress_info.get("updated_at", "")
            return jsonify(response), 200
        
        elif task_result.state == 'FAILURE':
            return jsonify({
                "status": "failed",
                "job_id": job_id,
                "error": str(task_result.info)
            }), 200

    # Default: assume still processing (task may not have started yet)
    return jsonify({
        "status": "processing",
        "job_id": job_id,
        "message": "Processing audio..."
    }), 200

@app.route('/api/process/music/<job_id>', methods=['GET'])
def get_music_results(job_id):
    """Get results of completed music processing (reads from Supabase)"""
    try:
        result = supabase.table('jobs').select('*').eq('id', job_id).execute()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not result.data:
        return jsonify({"error": "Job not found"}), 404

    row = result.data[0]

    if row['status'] != 'completed':
        return jsonify({
            "error": "Job not completed yet",
            "status": row['status']
        }), 400

    db_metadata = row.get('metadata') or {}
    stems_data  = row.get('stems_data') or {}

    # Build stem URLs from stems_data stored in Supabase
    stems_urls  = {}
    active_stems = []

    for stem_name in ['vocals', 'drums', 'bass', 'guitar', 'piano', 'other']:
        stem_info = stems_data.get(stem_name, {})
        is_active = stem_info.get('active', True)  # default True for backward compat

        # Prefer stored Supabase URL; fall back to local download endpoint
        stem_url = stem_info.get('url') or f"/api/download/{job_id}/{stem_name}.mp3"

        stems_urls[stem_name] = {"url": stem_url, "active": is_active}
        if is_active:
            active_stems.append(stem_name)

    return jsonify({
        "job_id": job_id,
        "status": "completed",
        "metadata": {
            "filename": row.get('filename'),
            "key": db_metadata.get('key'),
            "bpm": db_metadata.get('bpm'),
            "duration": db_metadata.get('duration'),
            "sample_rate": db_metadata.get('sample_rate'),
            "lyrics": db_metadata.get('lyrics'),
            "processed_at": db_metadata.get('processed_at')
        },
        "stems": stems_urls,
        "active_stems": active_stems
    }), 200

@app.route('/api/mix/<job_id>', methods=['POST'])
def mix_stems(job_id):
    """Mix selected stems into a single MP3, upload to Supabase, return URL"""
    import requests as http_requests
    import subprocess

    data = request.get_json() or {}
    selected_stems = data.get('stems', [])
    volumes = data.get('volumes', {})  # Optional: { stem_name: 0-100 }

    if not selected_stems:
        return jsonify({"error": "No stems provided"}), 400

    # Fetch job from Supabase to get stems_data (Supabase URLs)
    try:
        job_result = supabase.table('jobs').select('stems_data').eq('id', job_id).single().execute()
    except Exception as e:
        app.logger.error(f"Supabase fetch failed for job {job_id}: {e}")
        return jsonify({"error": "Job not found"}), 404

    if not job_result.data:
        return jsonify({"error": "Job not found"}), 404

    stems_data = job_result.data.get('stems_data') or {}

    # Download each selected stem to a temp directory
    tmp_dir = os.path.join('/tmp', job_id)
    os.makedirs(tmp_dir, exist_ok=True)

    stem_files = []
    try:
        for stem in selected_stems:
            stem_info = stems_data.get(stem)
            if not stem_info or not stem_info.get('url'):
                return jsonify({"error": f"Stem URL not found for: {stem}"}), 404

            stem_url = stem_info['url']
            tmp_path = os.path.join(tmp_dir, f"{stem}.mp3")

            response = http_requests.get(stem_url, timeout=60)
            if not response.ok:
                return jsonify({"error": f"Failed to download stem: {stem}"}), 502

            with open(tmp_path, 'wb') as f:
                f.write(response.content)

            stem_files.append((stem, tmp_path))

        # Output path for mixed file (also in tmp)
        mix_output = os.path.join(tmp_dir, 'mix.mp3')

        if len(stem_files) == 1:
            stem_name, stem_path = stem_files[0]
            vol = volumes.get(stem_name, 100)
            vol_float = round(vol / 100.0, 4)
            cmd = [
                'ffmpeg', '-y',
                '-i', stem_path,
                '-filter_complex', f'[0]volume={vol_float}[a]',
                '-map', '[a]',
                '-codec:a', 'libmp3lame',
                '-qscale:a', '2',
                mix_output
            ]
            subprocess.run(cmd, check=True, capture_output=True)
        else:
            # Build per-stem volume filters
            cmd = ['ffmpeg', '-y']
            for _, path in stem_files:
                cmd += ['-i', path]

            filter_parts = []
            mix_labels = []
            for i, (stem_name, _) in enumerate(stem_files):
                vol = volumes.get(stem_name, 100)
                vol_float = round(vol / 100.0, 4)
                label = chr(ord('a') + i)
                filter_parts.append(f'[{i}]volume={vol_float}[{label}]')
                mix_labels.append(f'[{label}]')

            n = len(stem_files)
            filter_complex = ';'.join(filter_parts) + f';{"".join(mix_labels)}amix=inputs={n}:duration=longest:normalize=0'

            cmd += [
                '-filter_complex', filter_complex,
                '-codec:a', 'libmp3lame',
                '-qscale:a', '2',
                mix_output
            ]
            subprocess.run(cmd, check=True, capture_output=True)

        # Upload mixed MP3 to Supabase Storage
        storage_path = f"{job_id}/mix.mp3"
        with open(mix_output, 'rb') as f:
            mix_bytes = f.read()

        supabase.storage.from_('jexy-stems').upload(
            path=storage_path,
            file=mix_bytes,
            file_options={"content-type": "audio/mpeg", "upsert": "true"}
        )

        # Get public URL
        public_url = supabase.storage.from_('jexy-stems').get_public_url(storage_path)

        # Schedule background cleanup of the mix file after 5 minutes
        def delete_mix_later(job_id):
            import time
            time.sleep(300)  # Wait 5 minutes to ensure download completes
            try:
                supabase.storage.from_('jexy-stems').remove([f"{job_id}/mix.mp3"])
                print(f"Cleaned up mix for job {job_id}")
            except Exception as e:
                print(f"Mix cleanup failed: {e}")

        threading.Thread(target=delete_mix_later, args=(job_id,), daemon=True).start()

        return jsonify({"url": public_url}), 200

    except subprocess.CalledProcessError as e:
        app.logger.error(f"ffmpeg mix failed: {e.stderr.decode()}")
        return jsonify({"error": "Mix failed"}), 500
    except Exception as e:
        app.logger.error(f"Mix error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up all temp files
        if os.path.exists(tmp_dir):
            shutil.rmtree(tmp_dir, ignore_errors=True)


# SPEECH PROCESSING routes

@app.route('/api/process/speech/<job_id>/status', methods=['GET'])
def get_speech_status(job_id):
    """Check status of speech processing job"""
    # Return cancelled status gracefully if the job was cancelled
    if redis_client.sismember('cancelled_jobs', job_id):
        return jsonify({"status": "cancelled", "job_id": job_id}), 200

    # Check Supabase for the job's current status
    try:
        result = supabase.table('jobs').select('status').eq('id', job_id).execute()
        if result.data:
            db_status = result.data[0]['status']
            if db_status == 'completed':
                return jsonify({
                    "status": "completed",
                    "job_id": job_id,
                    "message": "Processing complete"
                }), 200
            elif db_status == 'failed':
                return jsonify({
                    "status": "failed",
                    "job_id": job_id,
                    "error": "Processing failed"
                }), 200
    except Exception as e:
        app.logger.error(f"Supabase status check failed for job {job_id}: {e}")

    # Check Celery task state for progress
    celery_task_id = redis_client.get(f"celery_task:{job_id}")
    if celery_task_id:
        celery_task_id = celery_task_id.decode('utf-8')
        task_result = celery_app.AsyncResult(celery_task_id)
        
        if task_result.state == 'STARTED' or task_result.state == 'PENDING':
            # Check for progress stored by the processor
            progress_raw = redis_client.get(f"progress:{job_id}")
            response = {
                "status": "processing",
                "job_id": job_id,
                "message": "Processing speech..."
            }
            if progress_raw:
                progress_info = json.loads(progress_raw)
                response["progress"] = progress_info.get("percent", 0)
                response["current_step"] = progress_info.get("message", "Processing...")
                response["updated_at"] = progress_info.get("updated_at", "")
            return jsonify(response), 200
        
        elif task_result.state == 'FAILURE':
            return jsonify({
                "status": "failed",
                "job_id": job_id,
                "error": str(task_result.info)
            }), 200

    # Default: assume still processing
    return jsonify({
        "status": "processing",
        "job_id": job_id,
        "message": "Processing speech..."
    }), 200

@app.route('/api/process/speech/<job_id>', methods=['GET'])
def get_speech_results(job_id):
    """Get results of completed speech processing (reads from Supabase)"""
    try:
        result = supabase.table('jobs').select('*').eq('id', job_id).execute()
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    if not result.data:
        return jsonify({"error": "Job not found"}), 404

    row = result.data[0]

    if row['status'] != 'completed':
        return jsonify({
            "error": "Job not completed yet",
            "status": row['status']
        }), 400

    db_metadata = row.get('metadata') or {}
    transcript  = row.get('transcript') or {}

    # Prefer stored Supabase URL
    clean_audio_url = db_metadata.get('clean_audio_url')

    return jsonify({
        "job_id": job_id,
        "status": "completed",
        "metadata": {
            "filename": row.get('filename'),
            "duration": db_metadata.get('duration'),
            "sample_rate": db_metadata.get('sample_rate'),
            "transcript": transcript,
            "processed_at": db_metadata.get('processed_at')
        },
        "downloads": {
            "clean_audio": clean_audio_url,
            "transcript_txt": f"/api/download/transcript/{job_id}/txt",
            "transcript_json": f"/api/download/transcript/{job_id}/json",
            "transcript_srt": f"/api/download/transcript/{job_id}/srt"
        }
    }), 200

#Utils Routes

@app.route('/api/jobs', methods=['GET'])
def get_user_jobs():
    """Get all jobs for the authenticated user"""
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        result = supabase.table('jobs').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        return jsonify({"jobs": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/<job_id>/cancel', methods=['POST'])
def cancel_job(job_id):
    """Cancel an actively processing job, revoke Celery task, and clean up all data."""
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Verify job belongs to user before allowing cancellation
        result = supabase.table('jobs').select('user_id').eq('id', job_id).execute()
        if result.data and result.data[0]['user_id'] != user_id:
            return jsonify({"error": "Unauthorized"}), 403
    except Exception as e:
        app.logger.warning(f"Could not verify job ownership for {job_id}: {e}")

    # 1. Mark as cancelled in Redis
    redis_client.sadd('cancelled_jobs', job_id)

    # 2. Revoke the Celery task
    celery_task_id = redis_client.get(f"celery_task:{job_id}")
    if celery_task_id:
        celery_task_id = celery_task_id.decode('utf-8')
        celery_app.control.revoke(celery_task_id, terminate=True, signal='SIGTERM')

    # 3. Delete record from Supabase
    try:
        supabase.table('jobs').delete().eq('id', job_id).execute()
    except Exception as e:
        app.logger.error(f"Supabase delete failed during cancellation of job {job_id}: {e}")

    # 4. Delete any partially-written files from the filesystem
    job_dir = os.path.join(PROCESSED_DIR, job_id)
    if os.path.exists(job_dir):
        try:
            shutil.rmtree(job_dir)
        except Exception as e:
            app.logger.error(f"Filesystem cleanup failed for job {job_id}: {e}")

    return jsonify({"success": True, "message": "Job cancelled successfully"}), 200

@app.route('/api/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a specific job"""
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        # Verify job belongs to user
        result = supabase.table('jobs').select('user_id').eq('id', job_id).execute()
        if not result.data or result.data[0]['user_id'] != user_id:
            return jsonify({"error": "Job not found or unauthorized"}), 404
            
        # Delete from Supabase
        supabase.table('jobs').delete().eq('id', job_id).execute()
        
        # Delete from filesystem
        job_dir = os.path.join(PROCESSED_DIR, job_id)
        if os.path.exists(job_dir):
            shutil.rmtree(job_dir)
            
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/rate-limit/stats', methods=['GET'])
def get_rate_limit_stats():
    """Get rate limiter statistics"""
    stats = rate_limiter.get_stats()
    return jsonify(stats), 200

#  REAL-TIME Routes (Hope it works)

@app.route('/api/realtime/noise-reduction', methods=['POST'])
def realtime_noise_reduction():
    """
    Real-time noise reduction using noisereduce
    WebSocket or streaming endpoint for live audio
    """
    # TODO: Implement WebSocket for live noisereduce processing
    return jsonify({"message": "Real-time noise reduction - Coming soon"}), 200

@app.route('/api/realtime/transcription', methods=['POST'])
def realtime_transcription():
    """
    Real-time transcription using Deepgram API
    """
    # TODO: Implement Deepgram streaming integration
    return jsonify({"message": "Real-time transcription - Coming soon"}), 200

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)