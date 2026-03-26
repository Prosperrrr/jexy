import React from 'react';
import { History, FileAudio, CheckCircle2, Clock } from 'lucide-react';

const SessionHistory = () => {
  // Mock data as requested
  const mockJobs = [
    {
      id: '1',
      filename: 'ambient_city_001.wav',
      status: 'TRANSCRIBED',
      size: '14.2 MB',
      timeAgo: '2h ago',
      color: 'bg-emerald-500',
    },
    {
      id: '2',
      filename: 'interview_vocal_raw.flac',
      status: 'SEPARATED',
      size: '88.1 MB',
      timeAgo: '5h ago',
      color: 'bg-purple-500',
    },
    {
      id: '3',
      filename: 'bird_calls_dataset_v4.zip',
      status: 'CLASSIFIED',
      size: '1.2 GB',
      timeAgo: 'Yesterday',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="w-80 bg-white rounded-3xl border border-slate-100 flex flex-col shadow-sm flex-shrink-0 h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-slate-800" />
          <h2 className="font-display font-bold text-slate-900">Session History</h2>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {mockJobs.map((job) => (
          <div key={job.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 relative group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-display font-medium text-sm text-slate-900 truncate pr-4" title={job.filename}>
                {job.filename}
              </span>
              <span className="text-xs text-slate-400 whitespace-nowrap">{job.timeAgo}</span>
            </div>
            <div className="flex items-center text-xs space-x-3">
              <div className="flex items-center space-x-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${job.color}`}></div>
                <span className="text-slate-500 font-medium">{job.status}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{job.size}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-3xl mt-auto">
        <button className="w-full text-center py-3 text-xs font-display font-bold text-slate-400 tracking-wider hover:text-slate-600 transition-colors uppercase">
          VIEW ALL ARCHIVES
        </button>
      </div>
    </div>
  );
};

export default SessionHistory;
