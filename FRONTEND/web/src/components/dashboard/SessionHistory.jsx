import React, { useState, useEffect } from 'react';
import { History, FileAudio, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { getUserJobs, deleteJob } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const getStatusColor = (status, type) => {
  if (status !== 'completed') return 'bg-yellow-500';
  return type === 'music' ? 'bg-purple-500' : 'bg-emerald-500';
};

const formatStatus = (status, type) => {
  if (status !== 'completed') return status.toUpperCase();
  return type === 'music' ? 'SEPARATED' : 'ENHANCED';
};

const SessionHistory = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getUserJobs();
        setJobs(data.jobs || []);
      } catch {
        setError('Failed to load session history');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this session from your history?')) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (error) {
        console.error('Failed to delete job', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleJobClick = (job) => {
    if (job.status !== 'completed') return;
    
    // Navigate to respective route
    if (job.job_type === 'music') {
      navigate('/track-separation', { state: { jobId: job.id } });
    } else {
      navigate('/audio-enhancer', { state: { jobId: job.id } });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 flex flex-col shadow-sm mt-6 mb-12">
      {/* Header */}
      <div className="p-5 md:p-8 border-b border-slate-50">
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-slate-800" />
          <h2 className="font-display font-bold text-slate-900 text-lg">Session History</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-500">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <History className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[15px] font-medium text-slate-500">No sessions yet</p>
            <p className="text-sm">Upload an audio file to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => handleJobClick(job)}
                className={`bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group flex flex-col relative ${job.status === 'completed' ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
              >
                <button 
                  onClick={(e) => handleDelete(e, job.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-start mb-4 pr-6">
                  <div className="flex items-start space-x-3 w-full truncate pr-2">
                    <FileAudio className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-display font-bold text-sm text-slate-900 truncate" title={job.filename}>
                      {job.filename}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-auto uppercase tracking-wider font-semibold">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status, job.job_type)}`}></div>
                    <span className="text-slate-500">{formatStatus(job.status, job.job_type)}</span>
                  </div>
                  <div className="flex flex-col items-end text-slate-400 space-y-0.5">
                    <span>{job.metadata?.duration ? `${Math.round(job.metadata.duration)}s` : ''}</span>
                    <span>{timeAgo(job.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
