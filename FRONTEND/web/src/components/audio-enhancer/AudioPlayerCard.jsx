import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const AudioPlayerCard = ({
  metadata,
  isPlaying,
  setIsPlaying,
  currentTime,
  volume,
  setVolume,
  onVolumeToggle,
  onSeek,
  onSkipBack,
  onSkipForward,
  downloadUrl
}) => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
      {/* Waveform graphic */}
      <div className="w-full sm:w-40 md:w-48 h-[140px] sm:h-40 md:h-48 bg-[#F8FAFC] rounded-[20px] flex items-center justify-center shrink-0">
        <div className="flex items-center gap-1.5 h-16">
          {[40, 70, 40, 100, 60, 80, 50].map((height, i) => (
            <div 
              key={i} 
              className={`w-1.5 bg-[#3B82F6] rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ height: isPlaying ? `${Math.random() * 60 + 20}%` : `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full min-w-0 py-1 md:py-2">
        <div className="mb-6 md:mb-8 text-center md:text-left pl-0 md:pl-1">
          <h2 className="text-[20px] md:text-[22px] font-display font-bold text-slate-800 truncate tracking-tight">Enhanced {metadata.filename}</h2>
          <p className="text-[14px] md:text-[15px] font-medium text-slate-400 mt-1 md:mt-1.5">Processed with DeepFilterNet</p>
        </div>

        <div className="flex flex-col gap-5 md:gap-6 w-full">
          {/* Progress Bar Row */}
          <div className="flex items-center gap-3 md:gap-4 w-full pl-0 md:pl-1">
            <span className="text-[12px] md:text-[13px] font-medium text-[#94A3B8] w-8 md:w-10 shrink-0 font-display tracking-wide">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-2 group flex items-center cursor-pointer">
              <input 
                type="range" 
                min="0" 
                max={metadata.duration} 
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-[6px] bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-500/30 z-10"
              />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[6px] bg-[#3B82F6] rounded-l-lg pointer-events-none" 
                style={{ width: `${(currentTime / metadata.duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-[12px] md:text-[13px] font-medium text-[#94A3B8] w-8 md:w-10 text-right shrink-0 font-display tracking-wide">{formatTime(metadata.duration)}</span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 mt-1 md:mt-2 w-full">
            
            {/* Play Controls */}
            <div className="flex items-center justify-center sm:justify-start gap-5 md:gap-6 w-full sm:w-auto md:pl-5">
              <button onClick={onSkipBack} title="Skip Back 10s" className="relative group outline-none text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center w-8 h-8 shrink-0">
                <RotateCcw strokeWidth={2.5} className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute text-[7px] md:text-[8px] font-bold mt-0.5 ml-[1px]">10</span>
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause" : "Play"} 
                className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] shrink-0 bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-[0_6px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)] mx-2"
              >
                {isPlaying ? (
                  <Pause fill="currentColor" strokeWidth={0} className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Play fill="currentColor" strokeWidth={0} className="w-5 h-5 md:w-6 md:h-6 ml-1" />
                )}
              </button>
              
              <button onClick={onSkipForward} title="Skip Forward 10s" className="relative group outline-none text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center w-8 h-8 shrink-0">
                <RotateCw strokeWidth={2.5} className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute text-[7px] md:text-[8px] font-bold mt-0.5 ml-0.5">10</span>
              </button>
            </div>

            {/* Volume & Download */}
            <div className="flex items-center justify-center sm:justify-end gap-6 md:gap-8 w-full sm:w-auto">
              {/* Volume Slider (Hidden on extra small devices, visible on sm and up) */}
              <div className="hidden sm:flex items-center gap-3 w-[100px] md:w-[120px] group">
                <button onClick={onVolumeToggle} title={volume === 0 ? "Unmute" : "Mute"} className="flex-shrink-0 focus:outline-none">
                  {volume === 0 ? (
                    <VolumeX strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5 text-slate-300 hover:text-red-400 transition-colors" />
                  ) : (
                    <Volume2 strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5 text-[#94A3B8] hover:text-slate-500 transition-colors" />
                  )}
                </button>
                <div className="relative flex-1 h-[6px] group/vol flex items-center cursor-pointer">
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-full bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#94A3B8] hover:accent-slate-500 focus:outline-none z-10"
                  />
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#94A3B8] rounded-l-full pointer-events-none group-hover/vol:bg-slate-500 transition-colors" 
                    style={{ width: `${volume}%` }}
                  ></div>
                </div>
              </div>

              {/* Download Button */}
              <a 
                href={downloadUrl}
                download={`jexy_enhanced_${metadata.filename}`}
                title="Download Clean Audio"
                className="w-full sm:w-auto justify-center px-6 py-2.5 md:py-3 bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white text-[14px] md:text-[15px] font-semibold rounded-[10px] flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 tracking-wide focus:outline-none"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerCard;
