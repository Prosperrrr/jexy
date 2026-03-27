import React from 'react';
import { Mic2, Drum, Speaker, Guitar, Piano, Music4, Volume2, VolumeX } from 'lucide-react';

const iconsMap = {
  vocals: Mic2,
  drums: Drum,
  bass: Speaker,
  guitar: Guitar,
  piano: Piano,
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
  const Icon = iconsMap[id] || Music4;

  return (
    <div className="flex flex-col sm:flex-row bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:border-blue-200/60 transition-all duration-300 overflow-hidden mt-5 shrink-0 group">
      
      {/* Left Controls */}
      <div className="flex w-full sm:w-64 p-4 sm:p-5 flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100/50 relative bg-white/60 z-10 shrink-0 transition-colors group-hover:bg-white/90 gap-4 sm:gap-0">
        <div className="flex items-center justify-between sm:mb-6 w-full">
          <div className="flex items-center space-x-2 sm:space-x-3 w-auto shrink-0">
            <div className={`p-2 sm:p-2.5 rounded-xl ${soloed ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)]' : muted ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'} transition-all duration-300`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className={`font-display font-extrabold text-[14px] sm:text-[15px] tracking-tight transition-colors truncate ${muted ? 'text-slate-400' : 'text-slate-900'}`}>{name}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 ml-2">
            <button 
              onClick={onMuteToggle}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[10px] sm:text-[11px] font-black font-display transition-all ${muted ? 'bg-red-50 text-red-600 ring-1 ring-red-500/30 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              M
            </button>
            <button 
              onClick={onSoloToggle}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[10px] sm:text-[11px] font-black font-display transition-all ${soloed ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              S
            </button>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-3 px-1 w-full shrink-0">
          <button onClick={onMuteToggle} title="Mute Track" className="focus:outline-none hover:scale-110 transition-transform group/mute">
            {volume === 0 || muted ? <VolumeX className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-300 group-hover/mute:text-red-400" /> : <Volume2 className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${muted ? 'text-slate-300' : 'text-slate-400 group-hover/mute:text-blue-500'}`} />}
          </button>
          <div className="relative w-full h-1.5 bg-slate-100 rounded-lg flex items-center group/slider">
            <div 
              className={`absolute left-0 top-0 h-full rounded-lg transition-colors ${muted ? 'bg-slate-300' : 'bg-slate-400 group-hover/slider:bg-blue-500'}`}
              style={{ width: `${muted ? 0 : volume}%` }}
            ></div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={muted ? 0 : volume} 
              onChange={onVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Right Waveform Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center h-[104px] my-auto transition-opacity duration-300 ${muted ? 'opacity-30 grayscale' : 'opacity-100'}`}>
        
        {/* Animated aesthetic backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/10 to-transparent group-hover:translate-x-full duration-1000 ease-in-out transition-transform"></div>

        {/* Generic Premium SVG Waveform */}
        <svg preserveAspectRatio="none" viewBox="0 0 1000 60" className="w-full h-16 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id={`stroke-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M0 30 C 20 30, 30 15, 50 20 S 70 45, 100 40 S 130 10, 150 20 S 180 50, 200 45 S 230 15, 250 25 S 280 40, 300 35 S 330 15, 350 20 S 380 50, 400 40 S 430 10, 450 15 S 480 35, 500 30 S 530 45, 550 40 S 580 15, 600 25 S 630 40, 650 35 S 680 10, 700 20 S 730 45, 750 40 S 780 15, 800 20 S 830 50, 850 40 S 880 10, 900 15 S 930 35, 950 30 S 980 30, 1000 30" 
            stroke={`url(#stroke-${id})`} 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path d="M0 30 C 20 30, 30 15, 50 20 S 70 45, 100 40 S 130 10, 150 20 S 180 50, 200 45 S 230 15, 250 25 S 280 40, 300 35 S 330 15, 350 20 S 380 50, 400 40 S 430 10, 450 15 S 480 35, 500 30 S 530 45, 550 40 S 580 15, 600 25 S 630 40, 650 35 S 680 10, 700 20 S 730 45, 750 40 S 780 15, 800 20 S 830 50, 850 40 S 880 10, 900 15 S 930 35, 950 30 S 980 30, 1000 30 L 1000 60 L 0 60 Z" 
            fill={`url(#gradient-${id})`} 
          />
        </svg>
      </div>
    </div>
  );
};

export default StemTrack;
