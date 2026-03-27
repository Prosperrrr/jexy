import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SessionHistory from '../components/dashboard/SessionHistory';
import ProcessingPipeline from '../components/dashboard/ProcessingPipeline';
import {
  IdleView,
  UploadingView,
  ConfirmingView,
  ProcessingView,
  CompleteView,
  ErrorView
} from '../components/dashboard/DashboardStateViews';

// State Machine constants
const STATES = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  CONFIRMING_MUSIC: 'CONFIRMING_MUSIC',
  CONFIRMING_SPEECH: 'CONFIRMING_SPEECH',
  PROCESSING_MUSIC_STEMS: 'PROCESSING_MUSIC_STEMS',
  PROCESSING_MUSIC_TRANSCRIPT: 'PROCESSING_MUSIC_TRANSCRIPT',
  PROCESSING_SPEECH_DENOISE: 'PROCESSING_SPEECH_DENOISE',
  PROCESSING_SPEECH_TRANSCRIPT: 'PROCESSING_SPEECH_TRANSCRIPT',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

const DashboardPage = () => {
  const navigate = useNavigate();

  // State
  const [currentState, setCurrentState] = useState(STATES.IDLE);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Pipeline Tracking States
  const [pipelineType, setPipelineType] = useState('music');
  const [countdown, setCountdown] = useState(5);
  const [persistedJob, setPersistedJob] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jexy_completed_job');
      if (stored) setPersistedJob(JSON.parse(stored));
    } catch (e) { }
  }, []);

  // Handle file select from IDLE
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setCurrentState(STATES.UPLOADING);
    setUploadProgress(0);

    // Simulate Upload -> POST /api/upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Simulate response from YAMNet
        setTimeout(() => {
          setConfidence(98.4);
          // Simple heuristic: if filename contains 'speech', classify as speech
          const isSpeech = selectedFile.name.toLowerCase().includes('speech') || selectedFile.name.toLowerCase().includes('interview');
          setCurrentState(isSpeech ? STATES.CONFIRMING_SPEECH : STATES.CONFIRMING_MUSIC);
        }, 500);
      }
    }, 200);
  };

  const cancelUpload = () => {
    setCurrentState(STATES.IDLE);
    setFile(null);
    setUploadProgress(0);
  };

  const toggleClassification = () => {
    if (currentState === STATES.CONFIRMING_MUSIC) {
      setCurrentState(STATES.CONFIRMING_SPEECH);
    } else {
      setCurrentState(STATES.CONFIRMING_MUSIC);
    }
  };

  // Start Processing pipeline -> POST /api/process/{file_id}
  const startProcessing = () => {
    const mockJobId = 'job_' + Math.random().toString(36).substr(2, 9);
    setJobId(mockJobId);
    setPipelineType(currentState === STATES.CONFIRMING_MUSIC ? 'music' : 'speech');

    if (currentState === STATES.CONFIRMING_MUSIC) {
      setCurrentState(STATES.PROCESSING_MUSIC_STEMS);
    } else {
      setCurrentState(STATES.PROCESSING_SPEECH_DENOISE);
    }
  };

  // Mock polling effect for Processing states
  useEffect(() => {
    if (currentState === STATES.PROCESSING_MUSIC_STEMS) {
      const timer = setTimeout(() => {
        setCurrentState(STATES.PROCESSING_MUSIC_TRANSCRIPT);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentState === STATES.PROCESSING_MUSIC_TRANSCRIPT) {
      const timer = setTimeout(() => {
        setCurrentState(STATES.COMPLETE);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentState === STATES.PROCESSING_SPEECH_DENOISE) {
      const timer = setTimeout(() => {
        setCurrentState(STATES.PROCESSING_SPEECH_TRANSCRIPT);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentState === STATES.PROCESSING_SPEECH_TRANSCRIPT) {
      const timer = setTimeout(() => {
        setCurrentState(STATES.COMPLETE);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentState === STATES.COMPLETE) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        localStorage.setItem('jexy_completed_job', JSON.stringify({
          filename: file?.name || 'Processed Session',
          type: pipelineType,
          timestamp: new Date().toISOString()
        }));
        navigate(pipelineType === 'speech' ? '/audio-enhancer' : '/track-separation', { state: { jobId } });
      }
    } else {
      setCountdown(5); // Reset countdown when moving away from Complete
    }
  }, [currentState, countdown, navigate, jobId, file, pipelineType]);


  // Derived statuses for ProcessingPipeline component
  const getPipelineStatuses = () => {
    // Determine context type for explicit confirmation string binding
    const isSpeech = currentState.includes('SPEECH');
    const confirmDoneStr = isSpeech ? 'SPEECH' : 'MUSIC';

    const s = {
      yamnet: 'READY',
      confirm: 'READY',
      demucs: 'READY',
      whisper: 'READY'
    };

    switch (currentState) {
      case STATES.IDLE:
        // Everything acts exactly as initialized above natively
        break;
      case STATES.UPLOADING:
        s.yamnet = 'ACTIVE';
        s.confirm = 'QUEUED';
        s.demucs = 'QUEUED';
        s.whisper = 'QUEUED';
        break;
      case STATES.CONFIRMING_MUSIC:
      case STATES.CONFIRMING_SPEECH:
        s.yamnet = 'DONE';
        s.confirm = 'WAITING';
        s.demucs = 'QUEUED';
        s.whisper = 'QUEUED';
        break;
      case STATES.PROCESSING_MUSIC_STEMS:
      case STATES.PROCESSING_SPEECH_DENOISE:
        s.yamnet = 'DONE';
        s.confirm = confirmDoneStr;
        s.demucs = 'PROCESSING';
        s.whisper = 'QUEUED';
        break;
      case STATES.PROCESSING_MUSIC_TRANSCRIPT:
      case STATES.PROCESSING_SPEECH_TRANSCRIPT:
        s.yamnet = 'DONE';
        s.confirm = confirmDoneStr;
        s.demucs = 'DONE';
        s.whisper = 'PROCESSING';
        break;
      case STATES.COMPLETE:
        s.yamnet = 'DONE';
        s.confirm = confirmDoneStr;
        s.demucs = 'DONE';
        s.whisper = 'DONE';
        break;
      case STATES.ERROR:
        s.yamnet = 'DONE';
        s.confirm = confirmDoneStr;
        s.demucs = 'QUEUED';
        s.whisper = 'QUEUED';
        break;
      default:
        break;
    }
    return s;
  };

  // Render main view content
  const renderView = () => {
    switch (currentState) {
      case STATES.IDLE:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {persistedJob && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 z-10 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="truncate pr-4">
                    <h4 className="font-display font-bold text-white text-[15px] truncate">{persistedJob.filename}</h4>
                    <p className="text-[13px] text-slate-400 font-medium mt-0.5">Processing completed • {persistedJob.type === 'music' ? 'Stem Separation' : 'Speech Denoising'}</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto z-10 shrink-0">
                  <button onClick={() => navigate(persistedJob.type === 'speech' ? '/audio-enhancer' : '/track-separation')} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition-colors whitespace-nowrap text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] active:scale-95">
                    View Results
                  </button>
                </div>
              </div>
            )}
            <IdleView onFileSelect={handleFileSelect} />
          </div>
        );

      case STATES.UPLOADING:
        return (
          <UploadingView
            progress={uploadProgress}
            filename={file?.name || 'audio_file.wav'}
            onCancel={cancelUpload}
          />
        );

      case STATES.CONFIRMING_MUSIC:
        return (
          <ConfirmingView
            type="music"
            confidence={confidence}
            onConfirm={startProcessing}
            onToggle={toggleClassification}
          />
        );

      case STATES.CONFIRMING_SPEECH:
        return (
          <ConfirmingView
            type="speech"
            confidence={confidence}
            onConfirm={startProcessing}
            onToggle={toggleClassification}
          />
        );

      case STATES.PROCESSING_MUSIC_STEMS:
        return (
          <ProcessingView
            title="Stem Separation"
            subtitle="Separating raw audio signal into 4 distinct instrument stems using Demucs."
            activeTask="Separating Audio Stems"
            type="music"
            progress={100}
            isIndeterminate={true}
          />
        );

      case STATES.PROCESSING_MUSIC_TRANSCRIPT:
        return (
          <ProcessingView
            title="Neural Transcription"
            subtitle="Extracting high-fidelity text from separated vocal stems using the Whisper large-v3 model."
            activeTask="Transcribing Audio Stems"
            type="music"
            progress={100}
            isIndeterminate={true}
          />
        );

      case STATES.PROCESSING_SPEECH_DENOISE:
        return (
          <ProcessingView
            title="Speech Denoising"
            subtitle="Improving overall quality and reducing background noise using DeepFilterNet."
            activeTask="Denoising Audio..."
            type="speech"
            progress={100}
            isIndeterminate={true}
          />
        );

      case STATES.PROCESSING_SPEECH_TRANSCRIPT:
        return (
          <ProcessingView
            title="Transcribing Audio"
            subtitle="Extracting high-fidelity text from the enhanced speech file using the whisper large-v3 model."
            activeTask="Transcribing Speech Content"
            type="speech"
            progress={100}
            isIndeterminate={true}
          />
        );

      case STATES.COMPLETE:
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] transition-all animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 mb-8 rounded-full bg-emerald-50 flex items-center justify-center border-[6px] border-white shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">Processing Complete!</h2>
            <p className="text-slate-500 mb-8 max-w-md text-center text-[15px] leading-relaxed">
              Your audio has been successfully processed and the session is ready. Redirecting in <b className="text-slate-900 animate-pulse">{countdown}</b> seconds...
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.setItem('jexy_completed_job', JSON.stringify({
                    filename: file?.name || 'Processed Session',
                    type: pipelineType,
                    timestamp: new Date().toISOString()
                  }));
                  navigate(pipelineType === 'speech' ? '/audio-enhancer' : '/track-separation', { state: { jobId } });
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                View Results Now
              </button>
              <button onClick={() => {
                localStorage.setItem('jexy_completed_job', JSON.stringify({
                  filename: file?.name || 'Processed Session',
                  type: pipelineType,
                  timestamp: new Date().toISOString()
                }));
                setCurrentState(STATES.IDLE);
              }} className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-6 rounded-full border border-slate-200 transition-all shadow-sm active:scale-95">
                Back to Dashboard
              </button>
            </div>
          </div>
        );

      case STATES.ERROR:
        return <ErrorView error={errorMessage} onRetry={cancelUpload} />;

      default:
        return <IdleView onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-[32px] font-display font-bold text-slate-900 tracking-tight mb-2">User Dashboard</h1>
            <p className="text-slate-500 max-w-2xl font-medium">
              High-fidelity audio processing pipeline. Upload raw signals for classification, separation, and neural transcription.
            </p>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            {renderView()}
            <SessionHistory />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full xl:w-80 shrink-0">
          <div className="sticky top-0 pt-0">
            <ProcessingPipeline statuses={getPipelineStatuses()} type={currentState.includes('SPEECH') ? 'speech' : 'music'} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
