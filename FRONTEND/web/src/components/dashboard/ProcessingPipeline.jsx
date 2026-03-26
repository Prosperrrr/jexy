import React from 'react';
import { Network, CheckCircle2, ChevronRight, Mic2, Layers, Cpu, Check, Loader2, Play } from 'lucide-react';

const icons = {
  ACTIVE: <Play className="w-3.5 h-3.5 fill-current text-white" />,
  DONE: <Check className="w-4 h-4 text-emerald-500" />,
  WAITING: <div className="flex space-x-0.5"><div className="w-1 h-1 bg-slate-400 rounded-full"></div><div className="w-1 h-1 bg-slate-400 rounded-full opacity-70"></div><div className="w-1 h-1 bg-slate-400 rounded-full opacity-40"></div></div>,
  PROCESSING: <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />,
  QUEUED: <span className="text-[10px] font-bold text-slate-400">...</span>
};

const badgeClasses = {
  ACTIVE: "bg-blue-100/50 text-blue-600 ring-1 ring-blue-200/50 font-semibold px-2.5 py-1",
  DONE: "bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1",
  WAITING: "bg-slate-100 text-slate-400 font-bold px-2.5 py-1",
  PROCESSING: "bg-purple-50 text-purple-600 font-bold px-2.5 py-1",
  QUEUED: "bg-slate-100 text-slate-400 font-bold px-2.5 py-1"
};

const StageIcon = ({ type, status }) => {
  if (status === 'ACTIVE') {
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center
        ${status === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
      `}>
        {type === 'yamnet' && <div className="bg-blue-500 text-white w-5 h-5 rounded flex items-center justify-center"><div className="w-2.5 h-2.5 border-[1.5px] border-white rounded-sm"></div></div>}
        {type === 'confirm' && <Network className="w-5 h-5" />}
        {type === 'demucs' && <Layers className="w-5 h-5 text-purple-500" />}
        {type === 'whisper' && <Mic2 className="w-5 h-5" />}
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
  
  if (status === 'PROCESSING') {
    return (
      <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500">
        <Layers className="w-5 h-5 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
      {type === 'yamnet' && <Cpu className="w-5 h-5" />}
      {type === 'confirm' && <Network className="w-5 h-5" />}
      {type === 'demucs' && <Layers className="w-5 h-5" />}
      {type === 'whisper' && <Mic2 className="w-5 h-5" />}
    </div>
  );
};


const ProcessingPipeline = ({ statuses }) => {
  // statuses = { yamnet: 'ACTIVE', confirm: 'WAITING', demucs: 'QUEUED', whisper: 'QUEUED' }
  const defaultStatuses = {
    yamnet: 'ACTIVE',
    confirm: 'WAITING',
    demucs: 'QUEUED',
    whisper: 'QUEUED'
  };

  const currentStatuses = statuses || defaultStatuses;

  const steps = [
    { id: 'yamnet', title: 'YAMNet Classification', desc: 'Classifying 521 audio events for routing logic.' },
    { id: 'confirm', title: 'User Confirmation', desc: 'Heuristic review of identified audio segments.' },
    { id: 'demucs', title: 'Demucs / DeepFilterNet', desc: 'Signal separation (Vocal/BGM) or neural noise reduction.' },
    { id: 'whisper', title: 'Whisper Transcription', desc: 'Multi-lingual large-v3 model for high-precision text extraction.' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Network className="w-5 h-5 text-slate-800" />
          <h3 className="font-display font-bold text-slate-900">Processing Pipeline</h3>
        </div>
        <span className="text-xs font-display font-bold text-slate-400 tracking-wider">SEQUENCE V2.1</span>
      </div>

      <div className="space-y-0 relative">
        {steps.map((step, idx) => {
          const status = currentStatuses[step.id];
          const isLast = idx === steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              {!isLast && (
                <div className="absolute left-5 top-10 flex flex-col items-center justify-center space-y-1 h-8 opacity-30">
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                  <div className="w-0.5 h-1 bg-slate-400"></div>
                </div>
              )}
              
              <div className="flex items-start sm:items-center justify-between py-2 mb-6 gap-2">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <StageIcon type={step.id} status={status} />
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-[15px]">{step.title}</h4>
                    <p className="text-slate-500 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
                <div className={`rounded-full text-[10px] tracking-wider uppercase ${badgeClasses[status]}`}>
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
