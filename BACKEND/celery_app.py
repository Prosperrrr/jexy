"""
Celery task definitions for JEXY audio processing.

This module contains the Celery app and the two heavy processing tasks
(music and speech) that were previously run inside threading.Thread in app.py.

The Celery worker loads the AI models (Demucs, Whisper, DeepFilterNet) once
at startup, keeping them in GPU memory across tasks. The Flask web server
no longer needs to load these models at all.

Start the worker with:
    celery -A celery_app worker --loglevel=info --pool=solo --concurrency=1
"""

import os
os.environ['CUDA_VISIBLE_DEVICES'] = '0'
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import warnings
warnings.filterwarnings('ignore')

import logging
logging.getLogger('tensorflow').setLevel(logging.ERROR)
logging.getLogger('tensorflow_hub').setLevel(logging.ERROR)

from dotenv import load_dotenv
load_dotenv()

import json
import shutil
import redis
from celery import Celery
from celery.utils.log import get_task_logger
from supabase import create_client, Client

logger = get_task_logger(__name__)

# Redis URL (used for both Celery broker and direct key lookups)
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')

# Initialize Celery
celery_app = Celery(
    'jexy',
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    task_track_started=True,
    worker_prefetch_multiplier=1,   # One task at a time (GPU bottleneck)
    task_acks_late=True,            # Acknowledge after completion (safer)
    worker_max_tasks_per_child=50,  # Restart worker after 50 tasks to prevent memory leaks
)

# Redis client for direct key operations (progress, cancellation flags)
redis_client = redis.Redis.from_url(REDIS_URL)

# Supabase client
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DIR = os.path.join(BASE_DIR, 'processed')
os.makedirs(PROCESSED_DIR, exist_ok=True)


# ── Lazy model loading ──────────────────────────────────────────────────
# Models are loaded once per worker process on first use, then cached.

_music_processor = None
_speech_processor = None

def get_music_processor():
    global _music_processor
    if _music_processor is None:
        from models.music_processor import MusicProcessor
        _music_processor = MusicProcessor(supabase=supabase)
        logger.info("MusicProcessor loaded in Celery worker.")
    return _music_processor

def get_speech_processor():
    global _speech_processor
    if _speech_processor is None:
        from models.speech_processor import SpeechProcessor
        _speech_processor = SpeechProcessor(supabase=supabase)
        logger.info("SpeechProcessor loaded in Celery worker.")
    return _speech_processor


# ── Helper: check if a job has been cancelled ────────────────────────────

def is_cancelled(job_id):
    """Check Redis set to see if this job was cancelled by the user."""
    return redis_client.sismember('cancelled_jobs', job_id)


# ── Celery Tasks ─────────────────────────────────────────────────────────

@celery_app.task(bind=True, name='jexy.process_music')
def process_music_task(self, filepath, job_id):
    """Celery task: process a music file (Demucs stem separation + Whisper lyrics)."""

    # Store the Celery task ID so the cancel endpoint can revoke it
    redis_client.set(f"celery_task:{job_id}", self.request.id, ex=7200)

    try:
        # Check cancellation before starting heavy work
        if is_cancelled(job_id):
            logger.info(f"Job {job_id} was cancelled before music processing started.")
            return {"status": "cancelled", "job_id": job_id}

        music_processor = get_music_processor()
        result = music_processor.process(filepath, job_id)

        # Check cancellation after the long processing step
        if is_cancelled(job_id):
            logger.info(f"Job {job_id} was cancelled after processing; cleaning up.")
            job_dir = os.path.join(PROCESSED_DIR, job_id)
            if os.path.exists(job_dir):
                shutil.rmtree(job_dir, ignore_errors=True)
            return {"status": "cancelled", "job_id": job_id}

        # Update Supabase: status + metadata + stems_data
        try:
            music_metadata = {
                "key": result.get('key'),
                "bpm": result.get('bpm'),
                "duration": result.get('duration'),
                "sample_rate": result.get('sample_rate'),
                "lyrics": result.get('lyrics'),
                "processed_at": result.get('processed_at')
            }
            stems_data = {
                name: {"active": info.get('active'), "url": info.get('url', '')}
                for name, info in (result.get('stems') or {}).items()
            }
            supabase.table('jobs').update({
                'status': 'completed',
                'metadata': music_metadata,
                'stems_data': stems_data
            }).eq('id', job_id).execute()
        except Exception as e:
            logger.error(f"Supabase update failed for job {job_id}: {e}")

        return {"status": "completed", "job_id": job_id}

    except Exception as e:
        # Don't mark as failed if it was intentionally cancelled
        if is_cancelled(job_id):
            logger.info(f"Music job {job_id} raised exception after cancellation (expected): {e}")
            job_dir = os.path.join(PROCESSED_DIR, job_id)
            if os.path.exists(job_dir):
                shutil.rmtree(job_dir, ignore_errors=True)
            return {"status": "cancelled", "job_id": job_id}

        logger.error(f"Music processing failed for job {job_id}: {e}")
        # Update Supabase job status
        try:
            supabase.table('jobs').update({'status': 'failed'}).eq('id', job_id).execute()
        except Exception as db_e:
            logger.error(f"Supabase update failed for job {job_id}: {db_e}")

        raise  # Re-raise so Celery marks the task as FAILURE


@celery_app.task(bind=True, name='jexy.process_speech')
def process_speech_task(self, filepath, job_id):
    """Celery task: process a speech file (DeepFilterNet denoising + Whisper transcription)."""

    # Store the Celery task ID so the cancel endpoint can revoke it
    redis_client.set(f"celery_task:{job_id}", self.request.id, ex=7200)

    try:
        # Check cancellation before starting heavy work
        if is_cancelled(job_id):
            logger.info(f"Job {job_id} was cancelled before speech processing started.")
            return {"status": "cancelled", "job_id": job_id}

        speech_processor = get_speech_processor()
        result = speech_processor.process(filepath, job_id)

        # Check cancellation after the long processing step
        if is_cancelled(job_id):
            logger.info(f"Job {job_id} was cancelled after processing; cleaning up.")
            job_dir = os.path.join(PROCESSED_DIR, job_id)
            if os.path.exists(job_dir):
                shutil.rmtree(job_dir, ignore_errors=True)
            return {"status": "cancelled", "job_id": job_id}

        # Update Supabase: status + metadata + transcript
        try:
            speech_metadata = {
                "duration": result.get('duration'),
                "sample_rate": result.get('sample_rate'),
                "clean_audio_url": result.get('clean_audio_url', ''),
                "processed_at": result.get('processed_at')
            }
            supabase.table('jobs').update({
                'status': 'completed',
                'metadata': speech_metadata,
                'transcript': result.get('transcript')
            }).eq('id', job_id).execute()
        except Exception as e:
            logger.error(f"Supabase update failed for job {job_id}: {e}")

        return {"status": "completed", "job_id": job_id}

    except Exception as e:
        # Don't mark as failed if it was intentionally cancelled
        if is_cancelled(job_id):
            logger.info(f"Speech job {job_id} raised exception after cancellation (expected): {e}")
            job_dir = os.path.join(PROCESSED_DIR, job_id)
            if os.path.exists(job_dir):
                shutil.rmtree(job_dir, ignore_errors=True)
            return {"status": "cancelled", "job_id": job_id}

        logger.error(f"Speech processing failed for job {job_id}: {e}")
        # Update Supabase job status
        try:
            supabase.table('jobs').update({'status': 'failed'}).eq('id', job_id).execute()
        except Exception as db_e:
            logger.error(f"Supabase update failed for job {job_id}: {db_e}")

        raise  # Re-raise so Celery marks the task as FAILURE
