import React from 'react';
import { Network, CheckCircle2, Mic2, Layers, Cpu, Loader2, Play } from 'lucide-react';

const getBadgeClass = (status, pipelineType) => {
  if (status === 'ACTIVE') return "bg-blue-100/50 text-blue-600 ring-1 ring-blue-200/50 font-semibold px-2.5 py-1";
  if (status === 'DONE') return "bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1";
  if (status === 'WAITING') return "bg-amber-50 text-amber-600 font-bold px-2.5 py-1";
  if (status === 'MUSIC') return "bg-purple-50 text-purple-600 font-bold px-2.5 py-1";
  if (status === 'SPEECH') return "bg-blue-50 text-blue-600 font-bold px-2.5 py-1";
  if (status === 'PROCESSING') return pipelineType === 'speech' ? "bg-blue-50 text-blue-600 font-bold px-2.5 py-1" : "bg-purple-50 text-purple-600 font-bold px-2.5 py-1";
  return "bg-slate-100 text-slate-400 font-bold px-2.5 py-1";
};

const StageIcon = ({ nodeType, status, pipelineType }) => {
  if (status === 'ACTIVE') {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
        {nodeType === 'yamnet' && <div className="bg-blue-500 text-white w-5 h-5 rounded flex items-center justify-center"><div className="w-2.5 h-2.5 border-[1.5px] border-white rounded-sm"></div></div>}
        {nodeType === 'confirm' && <Network className="w-5 h-5" />}
        {nodeType === 'demucs' && <Layers className="w-5 h-5" />}
        {nodeType === 'whisper' && <Mic2 className="w-5 h-5" />}
      </div>
    );
  }

  if (status === 'DONE') {
    return (
      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
        <CheckCircle2 className="w-5 h-5 fill-current text-emerald-100" />
      </div>
    );
  }

  if (status === 'MUSIC' || status === 'SPEECH') {
    const isSpeech = status === 'SPEECH';
    return (
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-white ${isSpeech ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-purple-50 border-purple-100 text-purple-500'}`}>
        <CheckCircle2 className={`w-5 h-5 fill-current ${isSpeech ? 'text-blue-100' : 'text-purple-100'}`} />
      </div>
    );
  }
  
  if (status === 'WAITING') {
    return (
      <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
        <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-amber-400/80 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </div>
      </div>
    );
  }

  if (status === 'PROCESSING') {
    const isSpeech = pipelineType === 'speech';
    return (
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isSpeech ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-purple-50 border-purple-100 text-purple-500'}`}>
        {nodeType === 'demucs' && <Layers className="w-5 h-5" />}
        {nodeType === 'whisper' && <Mic2 className="w-5 h-5" />}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
      {nodeType === 'yamnet' && <Cpu className="w-5 h-5" />}
      {nodeType === 'confirm' && <Network className="w-5 h-5" />}
      {nodeType === 'demucs' && <Layers className="w-5 h-5" />}
      {nodeType === 'whisper' && <Mic2 className="w-5 h-5" />}
    </div>
  );
};

const ProcessingPipeline = ({ statuses, type = 'music' }) => {
  const defaultStatuses = {
    yamnet: 'READY',
    confirm: 'READY',
    demucs: 'READY',
    whisper: 'READY'
  };

  const currentStatuses = statuses || defaultStatuses;

  const steps = [
    { 
      id: 'yamnet', 
      title: 'YAMNet Classification', 
      desc: 'Classifying 521 audio events to determine audio type.' 
    },
    { 
      id: 'confirm', 
      title: 'User Confirmation', 
      desc: 'Confirm the detected audio type.' 
    },
    { 
      id: 'demucs', 
      title: 'Demucs / DeepFilterNet', 
      desc: 'Adaptive processing.' 
    },
    { 
      id: 'whisper', 
      title: 'Whisper Transcription', 
      desc: 'Generating transcripts from audio.' 
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col shrink-0 h-fit w-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
        <div className="flex items-center space-x-3">
          <Network className="w-4 h-4 text-slate-800" />
          <h3 className="font-display font-bold text-slate-900 text-sm">Processing Pipeline</h3>
        </div>
      </div>

      <div className="space-y-0 relative mt-2">
        {steps.map((step, idx) => {
          const status = currentStatuses[step.id];
          const isLast = idx === steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              {!isLast && (
                <div className="absolute left-[19px] top-10 flex flex-col items-center justify-center space-y-1 h-[26px] opacity-30">
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                </div>
              )}
              
              <div className="flex items-start justify-between py-1 mb-6 gap-2">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 shadow-sm rounded-full mt-0.5">
                    <StageIcon nodeType={step.id} status={status} pipelineType={type} />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="font-display font-bold text-slate-800 text-[13px] leading-tight pr-2">{step.title}</h4>
                    <p className="text-slate-400 text-[11.5px] leading-snug tracking-tight mt-1 max-w-[130px] xl:max-w-none">{step.desc}</p>
                  </div>
                </div>
                <div className={`shrink-0 rounded-full text-[9px] tracking-wider font-bold uppercase mt-0.5 ${getBadgeClass(status, type)}`}>
                  {status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingPipeline;
