import React from 'react';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ filename, bpm }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-6 px-8 border-b border-slate-200 bg-white sticky top-0 z-40 shrink-0">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl text-slate-900 tracking-tight truncate max-w-sm md:max-w-xl">
          {filename}
        </h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        {bpm && (
          <div className="hidden md:flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm tracking-wide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            <span>{bpm} BPM</span>
          </div>
        )}
        <button className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold px-5 py-2.5 rounded-full transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
