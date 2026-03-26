import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const timer = setTimeout(() => {
        // Redirect logic based on what pipeline we ran
        // Normally we'd track the pipeline type in state. Let's redirect to track-sep by default for demo
        navigate('/track-separation', { state: { jobId } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentState, navigate, jobId]);


  // Derived statuses for ProcessingPipeline component
  const getPipelineStatuses = () => {
    const s = {
      yamnet: 'QUEUED',
      confirm: 'QUEUED',
      demucs: 'QUEUED',
      whisper: 'QUEUED'
    };

    switch (currentState) {
      case STATES.IDLE:
        s.yamnet = 'QUEUED';
        break;
      case STATES.UPLOADING:
        s.yamnet = 'ACTIVE';
        break;
      case STATES.CONFIRMING_MUSIC:
      case STATES.CONFIRMING_SPEECH:
        s.yamnet = 'DONE';
        s.confirm = 'WAITING';
        break;
      case STATES.PROCESSING_MUSIC_STEMS:
      case STATES.PROCESSING_SPEECH_DENOISE:
        s.yamnet = 'DONE';
        s.confirm = 'DONE';
        s.demucs = 'PROCESSING';
        break;
      case STATES.PROCESSING_MUSIC_TRANSCRIPT:
      case STATES.PROCESSING_SPEECH_TRANSCRIPT:
        s.yamnet = 'DONE';
        s.confirm = 'DONE';
        s.demucs = 'DONE';
        s.whisper = 'PROCESSING';
        break;
      case STATES.COMPLETE:
        s.yamnet = 'DONE';
        s.confirm = 'DONE';
        s.demucs = 'DONE';
        s.whisper = 'DONE';
        break;
      case STATES.ERROR:
        s.yamnet = 'DONE';
        s.confirm = 'DONE';
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
        return <IdleView onFileSelect={handleFileSelect} />;
      
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
            title="Neural Transcription" 
            subtitle="Extracting high-fidelity text from separated vocal stems using the Whisper large-v3 model." 
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
        return <CompleteView />;
      
      case STATES.ERROR:
        return <ErrorView error={errorMessage} onRetry={cancelUpload} />;
        
      default:
        return <IdleView onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto flex gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-8">
            <h1 className="text-[32px] font-display font-bold text-slate-900 tracking-tight mb-2">User Dashboard</h1>
            <p className="text-slate-500 max-w-2xl font-medium">
              High-fidelity audio processing pipeline. Upload raw signals for classification, separation, and neural transcription.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col space-y-6">
            {renderView()}
            <ProcessingPipeline statuses={getPipelineStatuses()} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-0 pt-0">
            <SessionHistory />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
