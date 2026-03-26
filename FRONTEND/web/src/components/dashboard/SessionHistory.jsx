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
    <div className="w-full bg-white rounded-3xl border border-slate-100 flex flex-col shadow-sm mt-6 mb-12">
      {/* Header */}
      <div className="p-5 md:p-8 border-b border-slate-50">
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-slate-800" />
          <h2 className="font-display font-bold text-slate-900 text-lg">Session History</h2>
        </div>
      </div>

      {/* List */}
      <div className="p-4 md:p-6 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-3 w-full truncate pr-2">
                <FileAudio className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span className="font-display font-bold text-sm text-slate-900 truncate" title={job.filename}>
                  {job.filename}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-auto uppercase tracking-wider font-semibold">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${job.color}`}></div>
                <span className="text-slate-500">{job.status}</span>
              </div>
              <div className="flex flex-col items-end text-slate-400 space-y-0.5">
                <span>{job.size}</span>
                <span>{job.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="p-5 bg-slate-50/50 rounded-b-3xl mt-auto border-t border-slate-100 items-center justify-center flex">
        <button className="text-[11px] font-display font-bold text-slate-400 tracking-wider hover:text-slate-900 transition-colors uppercase">
          VIEW ALL ARCHIVES
        </button>
      </div>
    </div>
  );
};

export default SessionHistory;
