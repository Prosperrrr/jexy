import React from 'react';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ filename, bpm, onExport }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-8 px-6 md:px-12 bg-transparent sticky top-0 z-40 shrink-0 backdrop-blur-sm">
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200/60 shadow-sm hover:shadow-md rounded-full transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex flex-col">
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-md md:max-w-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
            {filename}
          </h1>
          <span className="text-[11px] font-bold text-slate-400 font-display tracking-widest uppercase mt-1">
            Separated Session
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-3 md:space-x-4">
        {bpm && (
          <div className="hidden md:flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide ring-1 ring-blue-500/10 shadow-[0_4px_10px_rgba(59,130,246,0.1)]">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>{bpm} BPM</span>
          </div>
        )}
        <button className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200/60 text-slate-500 hover:text-slate-900 hover:shadow-md rounded-full transition-all hover:scale-105 active:scale-95">
          <Share2 className="w-4 h-4" />
        </button>
        <button 
          onClick={onExport}
          title="Export Stems"
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 outline-none"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
