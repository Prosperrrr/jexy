import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Repeat, Volume2, MessageSquare } from 'lucide-react';

const BottomAudioPlayer = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isLyricsView,
  onPlayPause,
  onSeek,
  onSkipBack,
  onSkipForward,
  onVolumeChange,
  onLyricsToggle
}) => {
  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:pl-64 flex flex-col shrink-0">
      {/* Progress Bar (Full Width Top Edge) */}
      <div className="w-full h-[6px] bg-slate-100 relative group cursor-pointer" onClick={onSeek}>
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-white relative">
        {/* Left Section: Time & Lyrics Toggle */}
        <div className="flex flex-col space-y-4 w-32 pb-2">
          <span className="text-[10px] font-bold text-slate-500 font-display tracking-wider absolute top-2 left-6">
            {formatTime(currentTime)}
          </span>
          <button 
            onClick={onLyricsToggle}
            className={`flex items-center space-x-2 text-[10px] font-bold tracking-wider font-display transition-colors pt-4 ${isLyricsView ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>LYRICS</span>
          </button>
        </div>

        {/* Center Section: Playback Controls */}
        <div className="flex items-center space-x-6 pb-2">
          <button onClick={onSkipBack} className="text-slate-400 hover:text-slate-700 transition-colors relative">
            <RotateCcw className="w-5 h-5" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">10</span>
          </button>
          
          <button 
            onClick={onPlayPause}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 mx-2"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button onClick={onSkipForward} className="text-slate-400 hover:text-slate-700 transition-colors relative">
            <RotateCw className="w-5 h-5" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold mt-0.5">10</span>
          </button>
        </div>

        {/* Repeat Toggle */}
        <button className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-300 hover:text-slate-500 transition-colors">
          <Repeat className="w-3.5 h-3.5" />
        </button>

        {/* Right Section: Volume & Duration */}
        <div className="flex flex-col items-end w-32 pb-2">
          <span className="text-[10px] font-bold text-slate-500 font-display tracking-wider absolute top-2 right-6">
            {formatTime(duration)}
          </span>
          <div className="flex items-center space-x-2 w-full justify-end pt-5">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input 
              type="range" 
              min="0" max="100" 
              value={volume}
              onChange={onVolumeChange}
              className="w-24 h-1 bg-slate-200 rounded-lg appearance-none accent-blue-500 cursor-pointer" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BottomAudioPlayer;
