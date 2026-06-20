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
  onDurationChange,
  downloadUrl,
  isRepeating
}) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [audioDuration, setAudioDuration] = useState(metadata?.duration || 0);

  // Web Audio API refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const isAudioSetup = useRef(false);
  const barRefs = useRef([]);

  // MediaSession refs
  const setIsPlayingRef = useRef(setIsPlaying);
  const handleSeekInternalRef = useRef();
  const handleSkipBackInternalRef = useRef();
  const handleSkipForwardInternalRef = useRef();

  useEffect(() => { setIsPlayingRef.current = setIsPlaying; }, [setIsPlaying]);

  useEffect(() => {
    if ('mediaSession' in navigator && metadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata.filename || 'Enhanced Audio',
        artist: 'Jexy Enhancer',
        album: 'Jexy',
        artwork: [
          { src: 'https://www.jexy.me/og-image.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (setIsPlayingRef.current) setIsPlayingRef.current(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (setIsPlayingRef.current) setIsPlayingRef.current(false);
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (handleSeekInternalRef.current && details.seekTime !== undefined) {
          handleSeekInternalRef.current(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (handleSkipBackInternalRef.current) handleSkipBackInternalRef.current();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (handleSkipForwardInternalRef.current) handleSkipForwardInternalRef.current();
      });
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekto', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [metadata]);

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

  // Web Audio API visualizer sync
  useEffect(() => {
    if (isPlaying) {
      if (!isAudioSetup.current && audioRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512; // 256 bins, allows us to zoom in on vocal frequencies (0-4kHz)
        analyserRef.current.smoothingTimeConstant = 0.85; // Butter smooth falloff
        
        try {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
          isAudioSetup.current = true;
        } catch (e) {
          console.error("Audio context setup failed:", e);
        }
      }

      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const updateData = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          for (let i = 0; i < 45; i++) {
            if (barRefs.current[i]) {
              // Skip first 2 bins (muddy sub-bass) and take the next 45 bins (covers up to ~4kHz, perfect for voice)
              const val = dataArray[i + 2] || 0;
              const boost = 1 + (i / 30); // Boost higher frequencies so right side bars animate well
              const height = Math.min(100, Math.max(8, (val / 255) * 100 * boost));
              barRefs.current[i].style.height = `${height}%`;
            }
          }
        }
        animationRef.current = requestAnimationFrame(updateData);
      };
      
      updateData();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Reset bars to resting state when paused
      for (let i = 0; i < 45; i++) {
        if (barRefs.current[i]) {
          barRefs.current[i].style.height = '8%';
        }
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

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

  handleSeekInternalRef.current = handleSeekInternal;
  handleSkipBackInternalRef.current = handleSkipBackInternal;
  handleSkipForwardInternalRef.current = handleSkipForwardInternal;

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
            if (onDurationChange) onDurationChange(e.target.duration);
          }
        }}
      />
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
         {/* Real-time Web Audio API Equalizer */}
         <div className="flex items-center gap-2 h-20 w-full justify-between px-8 opacity-80">
          {Array.from({ length: 45 }).map((_, i) => (
            <div 
              key={i} 
              ref={el => barRefs.current[i] = el}
              className="w-1.5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full origin-bottom"
              style={{ 
                height: '8%', // Starting resting height
                transition: 'height 0.05s ease' 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerCard;
