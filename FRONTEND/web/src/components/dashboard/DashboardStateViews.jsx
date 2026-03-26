import React, { useRef } from 'react';
import { Plus, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';

export const IdleView = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-8">
        <Plus className="w-6 h-6 text-slate-900" />
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Initialize New Session</h2>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
        Select your audio source (WAV, FLAC, MP3) to begin processing in the cloud.
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".mp3,.wav,.flac,.ogg,.m4a"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="font-display bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-12 rounded-full transition-colors shadow-lg"
      >
        Select Raw Audio
      </button>
    </div>
  );
};

export const UploadingView = ({ progress, filename, onCancel }) => {
  return (
    <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Uploading audio file...</h2>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
        Sending signals to YAMNet for classification.
      </p>

      {/* Upload Progress Bar container */}
      <div className="w-full max-w-md bg-slate-100 rounded-full h-2 mb-4 overflow-hidden relative">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 left-0 top-0 absolute" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between w-full max-w-md text-sm font-semibold mt-8 text-slate-400">
        <span className="font-display truncate max-w-[200px] text-slate-900">{filename}</span>
        <button onClick={onCancel} className="font-display text-red-500 hover:text-red-600 uppercase tracking-wider text-xs font-bold">CANCEL UPLOAD</button>
      </div>
    </div>
  );
};

export const ConfirmingView = ({ type, confidence, onConfirm, onToggle }) => {
  const isMusic = type === 'music';
  return (
    <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]">
      <div className={`w-16 h-16 ${isMusic ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'} rounded-full flex items-center justify-center mb-8`}>
        {isMusic ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4"/></svg>
        )}
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
        {isMusic ? 'Music Detected' : 'Speech Detected'}
      </h2>
      <p className="text-slate-500 mb-10 max-w-md mx-auto">
        YAMNet classified audio as {isMusic ? 'Music' : 'Speech'} with {confidence}% confidence
      </p>
      
      <div className="w-full max-w-md mb-10">
        <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase mb-3 text-slate-400">
          <span>CONFIDENCE SCORE</span>
          <span className={isMusic ? 'text-purple-600' : 'text-blue-600'}>{confidence}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
          <div 
            className={`h-2 rounded-full absolute left-0 top-0 transition-all duration-1000 ${isMusic ? 'bg-purple-500' : 'bg-blue-500'}`} 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onConfirm}
          className={`font-display ${isMusic ? 'bg-purple-50 hover:bg-purple-100 text-purple-700' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'} font-bold py-4 px-8 rounded-full transition-colors`}
        >
          {isMusic ? 'PROCEED WITH STEM SEPARATION' : 'PROCEED WITH DENOISING'}
        </button>
        <button 
          onClick={onToggle}
          className="font-display bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold py-4 px-8 rounded-full transition-colors"
        >
          No, it's {isMusic ? 'Speech' : 'Music'}
        </button>
      </div>
    </div>
  );
};

export const ProcessingView = ({ title, subtitle, progress, isIndeterminate = false, activeTask, type }) => {
  const isMusic = type === 'music';
  const colorClass = isMusic ? 'bg-purple-500' : 'bg-blue-500';
  const lightColorClass = isMusic ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600';
  const iconClass = isMusic ? 'text-purple-600' : 'text-blue-600';

  return (
    <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]">
      <div className={`w-16 h-16 ${lightColorClass} rounded-full flex items-center justify-center mb-8`}>
        {isMusic ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4"/></svg>
        )}
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">{title}</h2>
      
      <div className="w-full max-w-md mt-10 mb-8">
        <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase mb-3">
          <span className={iconClass}>ACTIVE TASK</span>
          <span className={iconClass}>{activeTask}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
          {isIndeterminate ? (
            <div className={`h-2 rounded-full absolute top-0 ${colorClass} w-1/3 animate-[pulse_2s_ease-in-out_infinite]`}></div>
          ) : (
            <div className={`h-2 rounded-full absolute left-0 top-0 transition-all duration-300 ${colorClass}`} style={{ width: `${progress}%` }}></div>
          )}
        </div>
      </div>
      
      <p className="text-slate-500 max-w-md mx-auto font-medium">
        {subtitle}
      </p>

      <button className={`mt-10 font-display ${lightColorClass} font-bold py-4 px-12 rounded-full pointer-events-none flex items-center space-x-2`}>
        <RefreshCcw className="w-5 h-5 animate-spin" />
        <span>PROCESSING...</span>
      </button>
    </div>
  );
};

export const CompleteView = () => {
  return (
    <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4"/></svg>
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Processing Completed</h2>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
        All AI models have finished execution. Your results are now ready for review.
      </p>
      
      <button className="font-display bg-emerald-50 text-emerald-600 font-bold py-4 px-12 rounded-full flex items-center space-x-2 pointer-events-none">
        <CheckCircle2 className="w-5 h-5" />
        <span>PROCESSING COMPLETE</span>
      </button>
    </div>
  );
};

export const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[460px]">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-8 text-red-600">
        <XCircle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Processing Failed</h2>
      <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
        {error || 'An unexpected error occurred during processing.'}
      </p>
      
      <button 
        onClick={onRetry}
        className="font-display bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-12 rounded-full transition-colors shadow-lg flex items-center space-x-2"
      >
        <RefreshCcw className="w-5 h-5" />
        <span>Retry Upload</span>
      </button>
    </div>
  );
};
