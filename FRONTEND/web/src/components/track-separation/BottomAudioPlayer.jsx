import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Repeat, Volume2, VolumeX, MessageSquare, ListMusic } from 'lucide-react';

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
  onVolumeToggle,
  onLyricsToggle
}) => {
  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[90px] md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:left-[calc(50%+8rem)] md:w-[calc(100%-20rem)] max-w-5xl z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-4 flex flex-col items-center justify-between ring-1 ring-slate-900/5">
        
        {/* Main Controls Row */}
        <div className="w-full flex items-center justify-between px-2 md:px-6 relative gap-4">
          
          {/* Left Section: Time & Lyrics Toggle */}
          <div className="flex items-center space-x-4 md:space-x-8 w-1/3">
            <span className="text-xs font-bold text-slate-500 font-display tracking-widest w-12 shrink-0">
              {formatTime(currentTime)}
            </span>
            <button 
              onClick={onLyricsToggle}
              title={isLyricsView ? "Stems View" : "Lyrics View"}
              className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-widest font-display transition-all duration-300 ${
                isLyricsView 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              {isLyricsView ? <ListMusic className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              <span className="hidden sm:inline">{isLyricsView ? 'STEMS' : 'LYRICS'}</span>
            </button>
          </div>

          {/* Center Section: Playback Controls */}
          <div className="flex items-center justify-center space-x-4 md:space-x-6 w-1/3">
            <button onClick={onSkipBack} title="-10sec" className="p-2 text-slate-400 hover:text-slate-800 transition-colors relative group">
              <RotateCcw className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
            </button>
            
            <button 
              onClick={onPlayPause}
              title={isPlaying ? "Pause" : "Play"}
              className="w-16 h-16 shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <button onClick={onSkipForward} title="+10sec" className="p-2 text-slate-400 hover:text-slate-800 transition-colors relative group">
              <RotateCw className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Right Section: Volume & Duration */}
          <div className="flex items-center justify-end space-x-4 md:space-x-8 w-1/3">
            <div className="hidden md:flex items-center space-x-3 w-32 justify-end">
              <button onClick={onVolumeToggle} title="Mute" className="focus:outline-none transition-colors group">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-300 group-hover:text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />}
              </button>
              <div className="relative w-20 h-1.5 bg-slate-200 rounded-full flex items-center group/vol">
                <div 
                  className="absolute left-0 top-0 h-full bg-slate-400 rounded-full group-hover/vol:bg-blue-500 transition-colors pointer-events-none"
                  style={{ width: `${volume}%` }}
                ></div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume}
                  onChange={onVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
            </div>
            <button title="Repeat" className="text-slate-300 hover:text-slate-600 transition-colors hidden sm:block">
              <Repeat className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-400 font-display tracking-widest w-12 text-right shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Floating Embedded Progress Bar */}
        <div className="w-[calc(100%-3rem)] h-1.5 bg-slate-100 rounded-full mt-5 relative group flex items-center">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full pointer-events-none"
            style={{ width: `calc(${progressPercent}% + ${8 - (progressPercent / 100) * 16}px)` }}
          />
          <input 
            type="range"
            min="0"
            max={duration || 100}
            step="0.01"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[4px] border-blue-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none"
            style={{ left: `calc(${progressPercent}% + ${8 - (progressPercent / 100) * 16}px)`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomAudioPlayer;
