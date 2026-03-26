import React from 'react';
import { Mic2, AlignJustify, Speaker, Music, LayoutGrid, Music4, Volume2, VolumeX } from 'lucide-react';

const iconsMap = {
  vocals: Mic2,
  drums: AlignJustify,
  bass: Speaker,
  guitar: Music,
  piano: LayoutGrid,
  other: Music4
};

const StemTrack = ({ 
  id, 
  name, 
  muted, 
  soloed, 
  volume, 
  onMuteToggle, 
  onSoloToggle, 
  onVolumeChange 
}) => {
  const Icon = iconsMap[id] || Music;

  return (
    <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4 shrink-0 transition-opacity">
      {/* Left Controls */}
      <div className="w-56 p-4 flex flex-col justify-center border-r border-slate-100 relative bg-white z-10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${soloed ? 'text-blue-600' : 'text-slate-700'}`} />
            <span className="font-display font-bold text-[15px] text-slate-900">{name}</span>
          </div>
          
          <div className="flex items-center rounded-md border border-slate-200 overflow-hidden">
            <button 
              onClick={onMuteToggle}
              className={`px-2 py-0.5 text-xs font-bold font-display border-r border-slate-200 transition-colors ${muted ? 'bg-slate-100 text-slate-400' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              M
            </button>
            <button 
              onClick={onSoloToggle}
              className={`px-2 py-0.5 text-xs font-bold font-display transition-colors ${soloed ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              S
            </button>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-2">
          {volume === 0 || muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400" />}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={muted ? 0 : volume} 
            onChange={onVolumeChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <Volume2 className="w-3.5 h-3.5 text-slate-400 opacity-60" />
        </div>
      </div>

      {/* Right Waveform Area */}
      <div className="flex-1 relative overflow-hidden bg-white flex items-center px-4 h-[88px] my-auto">
        {/* Mock Generic Waveform SVG */}
        <svg preserveAspectRatio="none" viewBox="0 0 1000 60" className="w-full h-12 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 L50 40 L100 20 L150 45 L200 15 L250 50 L300 25 L350 40 L400 10 L450 35 L500 20 L550 55 L600 25 L650 40 L700 15 L750 45 L800 25 L850 40 L900 10 L950 35 L1000 30" stroke="#3b82f6" strokeWidth="2" fill="none" className={muted ? 'stroke-slate-300' : 'stroke-blue-500'} />
          <path d="M0 30 L50 40 L100 20 L150 45 L200 15 L250 50 L300 25 L350 40 L400 10 L450 35 L500 20 L550 55 L600 25 L650 40 L700 15 L750 45 L800 25 L850 40 L900 10 L950 35 L1000 30 L1000 60 L0 60 Z" fill={muted ? '#cbd5e1' : '#60a5fa'} opacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

export default StemTrack;
