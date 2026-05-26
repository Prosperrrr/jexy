import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return "00:00";
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
  downloadUrl,
  isRepeating
}) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioDuration, setAudioDuration] = useState(metadata?.duration || 0);

  useEffect(() => {
    if (metadata?.duration) {
      setAudioDuration(metadata.duration);
    }
  }, [metadata?.duration]);

  // Fetch audio as a blob to bypass ngrok browser warnings with custom headers
  useEffect(() => {
    if (!downloadUrl || downloadUrl === '#') return;
    
    let objectUrl = null;
    let isMounted = true;

    const loadAudioBlob = async () => {
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Failed to load audio");
        const blob = await response.blob();
        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setAudioSrc(objectUrl);
        }
      } catch (err) {
        console.error("Audio fetch failed:", err);
      }
    };

    loadAudioBlob();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [downloadUrl]);

  // Sync isPlaying state to actual audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);

  // Sync volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Sync external seek requests to internal audio element
  useEffect(() => {
    if (audioRef.current) {
      const diff = Math.abs(audioRef.current.currentTime - currentTime);
      // Only force an update if difference is > 0.5s to prevent fighting with onTimeUpdate
      if (diff > 0.5) {
        audioRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  // Sync seek requests (only when onSeek is triggered by user)
  const handleSeekInternal = (timeVals) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeVals;
    }
    onSeek(timeVals);
  };

  const handleSkipBackInternal = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      onSkipBack(); // Keep parent in sync
    }
  };

  const handleSkipForwardInternal = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioDuration || 100, audioRef.current.currentTime + 10);
      onSkipForward(); // Keep parent in sync
    }
  };

  return (
    <div className="flex flex-col sm:flex-row bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden group w-full relative z-10">
      <audio 
        ref={audioRef}
        src={audioSrc || undefined}
        loop={isRepeating}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            onSeek(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={(e) => {
          if (e.target.duration && !isNaN(e.target.duration) && e.target.duration !== Infinity) {
            setAudioDuration(e.target.duration);
          }
        }}
      />
      <style>{`
        @keyframes equalize {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
      
      {/* Track Info (Left) */}
      <div className="w-full sm:w-64 bg-slate-100/50 p-4 sm:p-6 flex flex-col justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200/50 transition-colors group-hover:bg-slate-100/80">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner">
             <Volume2 className="w-6 h-6" />
          </div>
          <div className="truncate pr-2">
            <h3 className="font-display font-bold text-slate-900 text-lg tracking-tight truncate">Enhanced Audio</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{metadata?.filename}</p>
          </div>
        </div>
      </div>

      {/* Waveform Area (Right) */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[120px] bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
         {/* Animated Equalizer Visualizer (spanning wide) */}
         <div className="flex items-center gap-2 h-20 w-full justify-between px-8 opacity-80">
          {Array.from({ length: 45 }).map((_, i) => {
            // Predictable pseudo-random heights based on index so it doesn't flicker on re-render
            const height = 30 + (Math.sin(i * 0.5) * 20) + (Math.cos(i * 1.2) * 30) + 20;
            return (
              <div 
                key={i} 
                className="w-1.5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full transition-all duration-300 origin-bottom"
                style={{ 
                  height: `${Math.abs(height)}%`,
                  animation: isPlaying ? `equalize 0.8s ease-in-out infinite` : 'none',
                  animationDelay: `${(i % 10) * 0.1}s`
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerCard;
