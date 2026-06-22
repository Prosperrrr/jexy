import React, { useState, useEffect } from 'react';
import { History, FileAudio, Loader2, AlertCircle, Trash2, Search } from 'lucide-react';
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

const formatDuration = (duration) => {
  const num = Number(duration);
  if (isNaN(num) || num <= 0) return '';
  return `${Math.round(num)}s`;
};

const SessionHistory = ({ filterType = null, title = "Session History", emptyTitle = "No sessions yet", emptyMessage = "Upload an audio file to get started.", emptyAction = null }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const typeFilteredJobs = jobs.filter(job => filterType ? job.job_type === filterType : true);
  const filteredJobs = typeFilteredJobs.filter(job => 
    job.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleJobs = isExpanded ? filteredJobs : filteredJobs.slice(0, 6);

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
      navigate('/track-separation', { state: { jobId: job.id, filename: job.filename } });
    } else {
      navigate('/audio-enhancer', { state: { jobId: job.id, filename: job.filename } });
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 flex flex-col shadow-sm mt-6 mb-12 transition-all duration-500 ease-in-out">
      {/* Header */}
      <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <History className="w-5 h-5 text-slate-800" />
          <h2 className="font-display font-bold text-slate-900 text-lg">{title}</h2>
          {!loading && (
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0">
              {jobs.length} Total
            </span>
          )}
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-300 focus:bg-white transition-all text-slate-600 placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
        ) : typeFilteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <History className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[15px] font-medium text-slate-500 mb-1">{emptyTitle}</p>
            <p className="text-sm mb-6 text-center">{emptyMessage}</p>
            {emptyAction && (
              <button 
                onClick={emptyAction.onClick} 
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                {emptyAction.label}
              </button>
            )}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[15px] font-medium text-slate-500">No results found</p>
            <p className="text-sm">No sessions match your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {visibleJobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => handleJobClick(job)}
                className={`bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group flex flex-col relative ${job.status === 'completed' ? 'cursor-pointer' : 'cursor-default opacity-80'} animate-[fadeIn_0.5s_ease-out_forwards]`}
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
                    <span>{formatDuration(job.metadata?.duration)}</span>
                    <span>{timeAgo(job.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      {filteredJobs.length > 6 && (
        <div className="p-5 bg-slate-50/50 rounded-b-3xl mt-auto border-t border-slate-100 items-center justify-center flex transition-colors hover:bg-slate-100/50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <button className="text-[11px] font-display font-bold text-slate-500 tracking-wider transition-colors uppercase">
            {isExpanded ? 'VIEW LESS' : 'VIEW ALL ARCHIVES'}
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SessionHistory;
