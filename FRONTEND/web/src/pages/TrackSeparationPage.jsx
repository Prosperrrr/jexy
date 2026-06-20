import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import posthog from 'posthog-js';
import DashboardLayout from '../components/DashboardLayout';
import { mixStemsClientSide } from '../utils/audioMixer';
import SessionHistory from '../components/dashboard/SessionHistory';
import Header from '../components/track-separation/Header';
import TimelineRuler from '../components/track-separation/TimelineRuler';
import StemTrack from '../components/track-separation/StemTrack';
import LyricsView from '../components/track-separation/LyricsView';
import BottomAudioPlayer from '../components/track-separation/BottomAudioPlayer';
import api, { getMusicResults } from '../services/api';
import { Loader2 } from 'lucide-react';

const formatStemName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const TrackSeparationPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobId = location.state?.jobId || queryParams.get('jobId');

  useEffect(() => {
    if (isLoaded && !isSignedIn && !jobId) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, jobId, navigate]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = React.useRef(isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLyricsView, setIsLyricsView] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(80);
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);

  const [stemStates, setStemStates] = useState({});
  const [stemUrls, setStemUrls] = useState({});
  const [downloadedBuffers, setDownloadedBuffers] = useState({});
  const [isDecoding, setIsDecoding] = useState(false);
  const [stemsReady, setStemsReady] = useState(false);
  const [showDecodingToast, setShowDecodingToast] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const isRepeatingRef = React.useRef(isRepeating);
  const [stemPeaks, setStemPeaks] = useState({});
  
  // Hacks for mobile background playback & Media Session
  const silentAudioRef = React.useRef(null);
  const togglePlayRef = React.useRef();
  const handleSeekRef = React.useRef();
  const currentTimeRef = React.useRef(currentTime);

  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);

  useEffect(() => {
    if (silentAudioRef.current) {
      if (isPlaying) {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
      } else {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if ('mediaSession' in navigator && data?.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: data.metadata.filename || 'Separated Audio',
        artist: 'Jexy Stems',
        album: 'Jexy',
        artwork: [
          { src: 'https://www.jexy.me/og-image.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (togglePlayRef.current) togglePlayRef.current();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (togglePlayRef.current) togglePlayRef.current();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (handleSeekRef.current && details.seekTime !== undefined) {
           handleSeekRef.current(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (handleSeekRef.current) handleSeekRef.current(Math.max(0, currentTimeRef.current - 10));
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (handleSeekRef.current) handleSeekRef.current(currentTimeRef.current + 10);
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
  }, [data]);

  // Web Audio API refs
  const audioCtx = React.useRef(null);
  const audioBuffers = React.useRef({});
  const sourceNodes = React.useRef({});
  const gainNodes = React.useRef({});
  const masterGain = React.useRef(null);
  const startTimeRef = React.useRef(0);
  const pausedAtRef = React.useRef(0);
  const reqAnimFrameId = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let activeJobId = jobId;

        if (!activeJobId) {
          setShowHistory(true);
          setLoading(false);
          return;
        }

        setShowHistory(false);
        setLoading(true);

        const result = await getMusicResults(activeJobId);

        // Render only stem tracks where active: true
        if (result?.stems) {
          result.active_stems = Object.keys(result.stems).filter(
            stem => result.stems[stem]?.active === true
          );
        }

        // Fix duration string (e.g. "3:45" to 225)
        if (result?.metadata?.duration && typeof result.metadata.duration === 'string') {
          const parts = result.metadata.duration.split(':');
          if (parts.length === 2) {
            result.metadata.duration = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          }
        }

        setData(result);

        const savedState = localStorage.getItem(`jexy_state_${activeJobId}`);
        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
            if (parsed.stemStates) setStemStates(parsed.stemStates);
            if (parsed.globalVolume !== undefined) setGlobalVolume(parsed.globalVolume);
            if (parsed.isGlobalMuted !== undefined) setIsGlobalMuted(parsed.isGlobalMuted);
            if (parsed.isLyricsView !== undefined) setIsLyricsView(parsed.isLyricsView);
          } catch(e) { console.error('Failed to parse saved state', e); }
        } else {
          const initialStems = (result.active_stems || []).reduce((acc, stem) => {
            acc[stem] = { muted: false, soloed: false, volume: 80 };
            return acc;
          }, {});
          setStemStates(initialStems);
        }

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Map stem URLs and fetch array buffers immediately
  useEffect(() => {
    if (!data?.active_stems) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const newUrls = {};

    data.active_stems.forEach(stem => {
      const stemPath = data.stems[stem]?.url;
      if (stemPath) {
        newUrls[stem] = stemPath.startsWith('http') ? stemPath : `${baseURL}${stemPath}`;
      }
    });

    setStemUrls(prev => ({ ...prev, ...newUrls }));
    
    let isMounted = true;
    const fetchBuffers = async () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        masterGain.current = audioCtx.current.createGain();
        masterGain.current.connect(audioCtx.current.destination);
      }

      setIsDecoding(true);
      const buffers = {};
      try {
        // Step 1: Fetch all array buffers first
        const fetchedData = [];
        for (const stem of data.active_stems) {
          if (!newUrls[stem]) continue;
          try {
            const response = await fetch(newUrls[stem]);
            const arrayBuffer = await response.arrayBuffer();
            buffers[stem] = arrayBuffer;
            fetchedData.push({ stem, arrayBuffer });
          } catch (err) {
            console.warn(`Failed to fetch stem: ${stem}`, err);
          }
        }
        
        if (isMounted) {
          setDownloadedBuffers(buffers);
          setStemsReady(true); // Show UI immediately after fetching
        }

        // Step 2: Decode in background
        const validData = fetchedData.filter(Boolean);
        const peaks = {};
        await Promise.all(
          validData.map(async ({ stem, arrayBuffer }) => {
             const audioBuffer = await audioCtx.current.decodeAudioData(arrayBuffer);
             audioBuffers.current[stem] = audioBuffer;
             
             // Extract aesthetic waveform peaks (150 vertical bars via RMS)
             const channelData = audioBuffer.getChannelData(0);
             const numBars = 150;
             const step = Math.ceil(channelData.length / numBars);
             const stemPeakData = [];
             for (let i = 0; i < numBars; i++) {
               let sum = 0;
               let count = 0;
               // Sample subset for speed
               for (let j = 0; j < step; j += 10) {
                 const idx = (i * step) + j;
                 if (idx < channelData.length) {
                   sum += Math.abs(channelData[idx]);
                   count++;
                 }
               }
               stemPeakData.push(count > 0 ? sum / count : 0);
             }
             // Normalize peaks to 0-1 and apply a tiny curve for visibility
             const maxAvg = Math.max(...stemPeakData, 0.001);
             peaks[stem] = stemPeakData.map(p => Math.pow(p / maxAvg, 0.7));

             const gain = audioCtx.current.createGain();
             gain.connect(masterGain.current);
             gainNodes.current[stem] = gain;
          })
        );
        
        if (isMounted) {
          setStemPeaks(peaks);
          setIsDecoding(false);
        }
      } catch (err) {
        console.error("Failed to fetch/decode audio buffers:", err);
        if (isMounted) setIsDecoding(false);
      }
    };

    fetchBuffers();
    return () => { isMounted = false; };
  }, [data]);

  // Cleanup Web Audio API when unmounting
  useEffect(() => {
    return () => {
      if (reqAnimFrameId.current) {
        cancelAnimationFrame(reqAnimFrameId.current);
      }
      Object.keys(sourceNodes.current).forEach(stem => {
        if (sourceNodes.current[stem]) {
          try { sourceNodes.current[stem].stop(); } catch (e) {}
          try { sourceNodes.current[stem].disconnect(); } catch (e) {}
        }
      });
      if (audioCtx.current && audioCtx.current.state !== 'closed') {
        audioCtx.current.close().catch(() => {});
      }
    };
  }, []);

  const updateCurrentTime = () => {
    if (!audioCtx.current || !data) return;
    
    // Use actual decoded buffer duration as source of truth, fallback to metadata
    let actualDuration = data.metadata.duration || 100;
    const firstStem = data.active_stems[0];
    if (audioBuffers.current && firstStem && audioBuffers.current[firstStem]) {
      actualDuration = audioBuffers.current[firstStem].duration;
    }

    const elapsed = audioCtx.current.currentTime - startTimeRef.current;
    
    if (elapsed >= actualDuration) {
       if (isRepeatingRef.current) {
         handleSeek(0);
         reqAnimFrameId.current = requestAnimationFrame(updateCurrentTime);
         return;
       }
       setIsPlaying(false);
       isPlayingRef.current = false;
       stopPlayback();
       setCurrentTime(0);
       pausedAtRef.current = 0;
       if (silentAudioRef.current) silentAudioRef.current.pause();
       return;
    }
    
    setCurrentTime(elapsed);
    reqAnimFrameId.current = requestAnimationFrame(updateCurrentTime);
  };

  const startPlayback = (offset) => {
    Object.keys(audioBuffers.current).forEach(stem => {
      const source = audioCtx.current.createBufferSource();
      source.buffer = audioBuffers.current[stem];
      source.connect(gainNodes.current[stem]);
      source.start(0, offset);
      sourceNodes.current[stem] = source;
    });
    startTimeRef.current = audioCtx.current.currentTime - offset;
  };

  const stopPlayback = () => {
    Object.keys(sourceNodes.current).forEach(stem => {
      if (sourceNodes.current[stem]) {
        try { sourceNodes.current[stem].stop(); } catch (e) {}
        sourceNodes.current[stem].disconnect();
      }
    });
    sourceNodes.current = {};
    if (audioCtx.current) {
      pausedAtRef.current = audioCtx.current.currentTime - startTimeRef.current;
    }
  };

  const applyVolumes = () => {
    if (!audioCtx.current || !data) return;
    const hasSolo = Object.values(stemStates).some(s => s.soloed);
    const masterVol = isGlobalMuted ? 0 : (globalVolume / 100);
    if (masterGain.current) {
      masterGain.current.gain.value = masterVol;
    }
    
    data.active_stems.forEach(stem => {
      const gainNode = gainNodes.current[stem];
      if (gainNode) {
        const isEffectivelyMuted = stemStates[stem].muted || (hasSolo && !stemStates[stem].soloed);
        const stemVol = stemStates[stem].volume / 100;
        gainNode.gain.value = isEffectivelyMuted ? 0 : stemVol;
      }
    });
  };

  useEffect(() => {
    applyVolumes();
  }, [stemStates, globalVolume, isGlobalMuted, data, stemsReady]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (jobId && stemsReady && data) {
      const stateToSave = {
        stemStates,
        globalVolume,
        isGlobalMuted,
        isLyricsView
      };
      localStorage.setItem(`jexy_state_${jobId}`, JSON.stringify(stateToSave));
    }
  }, [stemStates, globalVolume, isGlobalMuted, isLyricsView, jobId, stemsReady, data]);

  // Handle browser suspending AudioContext when tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying && audioCtx.current && audioCtx.current.state !== 'running') {
        audioCtx.current.resume().catch(console.error);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!stemsReady) return;
    
    if (isDecoding) {
      setShowDecodingToast(true);
      setTimeout(() => setShowDecodingToast(false), 2500);
      return;
    }
    
    if (audioCtx.current && audioCtx.current.state === 'suspended') {
       await audioCtx.current.resume();
    }

    const nextState = !isPlaying;
    setIsPlaying(nextState);
    isPlayingRef.current = nextState;

    if (nextState) {
       startPlayback(pausedAtRef.current);
       reqAnimFrameId.current = requestAnimationFrame(updateCurrentTime);
       if (silentAudioRef.current) silentAudioRef.current.play().catch(() => {});
    } else {
       stopPlayback();
       if (reqAnimFrameId.current) cancelAnimationFrame(reqAnimFrameId.current);
       if (silentAudioRef.current) silentAudioRef.current.pause();
    }
  };

  const toggleMute = (stem) => {
    setStemStates(prev => ({
      ...prev,
      [stem]: { ...prev[stem], muted: !prev[stem].muted }
    }));
  };

  const toggleSolo = (stem) => {
    setStemStates(prev => {
      const currentlySoloed = prev[stem].soloed;
      if (currentlySoloed) {
        return { ...prev, [stem]: { ...prev[stem], soloed: false } };
      }
      const newState = {};
      Object.keys(prev).forEach(s => {
        newState[s] = { ...prev[s], soloed: (s === stem) };
      });
      return newState;
    });
  };

  const changeStemVolume = (stem, val) => {
    setStemStates(prev => ({
      ...prev,
      [stem]: { ...prev[stem], volume: parseInt(val, 10) }
    }));
  };

  const handleSeek = (timeVal) => {
    if (data) {
      const clamped = Math.max(0, timeVal);
      setCurrentTime(clamped);
      
      const wasPlaying = isPlayingRef.current;
      if (wasPlaying) {
        stopPlayback();
        pausedAtRef.current = clamped;
        startPlayback(clamped);
        if (silentAudioRef.current) silentAudioRef.current.play().catch(() => {});
      } else {
        pausedAtRef.current = clamped;
      }
    }
  };

  const handleSkipBack = () => handleSeek(currentTime - 10);
  const handleSkipForward = () => handleSeek(currentTime + 10);

  // Ensure the silent audio is heavily muted so users don't hear an echo
  useEffect(() => {
    if (silentAudioRef.current) {
      silentAudioRef.current.volume = 0.01;
    }
  }, [stemUrls, data]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/track-separation?jobId=${jobId}`;
    const shareData = {
      title: data?.metadata?.filename ? `Jexy - ${data.metadata.filename}` : 'Jexy Separated Stems',
      text: data?.metadata?.filename ? `Check out my separated track "${data.metadata.filename}" on Jexy!` : 'Check out this separated track on Jexy!',
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
           navigator.clipboard.writeText(shareUrl);
           alert('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleExport = async () => {
    if (!data || isExporting) return;

    const hasSolo = Object.values(stemStates).some(s => s.soloed);
    const activeStemNames = Object.keys(stemStates).filter(stem => {
      const isMuted = stemStates[stem].muted;
      const isSoloed = stemStates[stem].soloed;
      const isEffectivelyMuted = isMuted || (hasSolo && !isSoloed);
      return !isEffectivelyMuted;
    });

    if (activeStemNames.length === 0) return;

    setIsExporting(true);
    try {
      const cleanFilename = data.metadata.filename.replace(/\.mp3$/i, '').replace(/\s+/g, '_');

      if (activeStemNames.length === 1) {
        const fileRes = await fetch(data.stems[activeStemNames[0]].url);
        const blob = await fileRes.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `jexy_${activeStemNames[0]}_${cleanFilename}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        posthog?.capture('Export Stem', {
          stem: activeStemNames[0],
        });
      } else {
        // Build stems payload for client-side mixing
        const stemsToMix = activeStemNames.map(stem => {
          const stemInfo = data.stems[stem];
          return {
            name: stem,
            url: stemInfo.url,
            volume: stemStates[stem].volume ?? 100
          };
        });

        const blob = await mixStemsClientSide(stemsToMix);
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        
        const stemLabel = activeStemNames.join('_');
        a.download = `jexy_${stemLabel}_mix_${cleanFilename}.mp3`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        posthog?.capture('Export Mix', {
          stems_count: activeStemNames.length,
          stems: activeStemNames,
        });
      }
    } catch (err) {
      console.error("Export mix failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  togglePlayRef.current = togglePlay;
  handleSeekRef.current = handleSeek;

  if (showHistory) {
    return (
      <DashboardLayout activeTab="stems">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <SessionHistory 
              title="Music History"
              filterType="music" 
              emptyTitle="No Music History Found" 
              emptyMessage="You haven't separated any tracks yet. Process an audio file on the dashboard to get started." 
              emptyAction={{ label: 'Back to Dashboard', onClick: () => navigate('/dashboard') }}
            />
         </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-display font-medium text-slate-700">Loading Session...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-red-500 font-bold text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Error Loading Session</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Base URL from env for audio stems
  // const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <DashboardLayout>
      <audio 
        ref={silentAudioRef} 
        src={data?.active_stems?.[0] ? stemUrls[data.active_stems[0]] : undefined} 
        loop 
        playsInline 
        style={{ display: 'none' }} 
      />
      <div className="flex flex-col h-full relative" style={{ paddingBottom: '160px' }}>
        <Header
          filename={data.metadata.filename}
          bpm={data.metadata.bpm}
          onExport={handleExport}
          isExporting={isExporting}
          onShare={handleShare}
        />

        {showDecodingToast && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur text-white px-5 py-2.5 rounded-full shadow-lg z-50 flex items-center space-x-3 transition-opacity">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium tracking-wide">Preparing audio...</span>
          </div>
        )}

        {isLyricsView ? (
          <LyricsView lyrics={data.metadata.lyrics?.timestamped || []} currentTime={currentTime} />
        ) : (
          <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative pb-48">
            {!stemsReady ? (
              <div className="relative w-full px-4 sm:px-8 shrink-0">
                {/* Skeleton Timeline Wrapper */}
                <div className="flex w-full relative pt-6 z-20 mb-2">
                  <div className="hidden sm:block w-64 shrink-0"></div>
                  <div className="flex-1 h-6 bg-slate-200/60 animate-pulse rounded-md"></div>
                </div>

                {/* Skeleton Tracks Stack */}
                <div className="flex flex-col relative z-10 pb-10">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row bg-white/40 backdrop-blur-xl rounded-3xl border border-slate-200/40 shadow-sm overflow-hidden mt-5 shrink-0 animate-pulse">
                      
                      {/* Skeleton Left Controls */}
                      <div className="flex w-full sm:w-64 p-4 sm:p-5 flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100/50 relative bg-white/40 z-10 shrink-0 gap-4 sm:gap-0">
                        <div className="flex items-center justify-between sm:mb-6 w-full">
                          <div className="flex items-center space-x-2 sm:space-x-3 w-auto shrink-0">
                             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-200/70"></div>
                             <div className="h-4 w-16 sm:w-20 bg-slate-200/70 rounded-md"></div>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 ml-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/70"></div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/70"></div>
                          </div>
                        </div>

                        {/* Skeleton Volume Slider */}
                        <div className="flex items-center space-x-3 px-1 w-full shrink-0">
                           <div className="w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-200/70"></div>
                           <div className="w-full h-1.5 bg-slate-200/70 rounded-lg"></div>
                        </div>
                      </div>

                      {/* Skeleton Right Waveform Area */}
                      <div className="flex-1 relative overflow-hidden flex items-center justify-center h-[104px] my-auto px-4 sm:px-8">
                         <div className="w-full h-8 bg-slate-200/40 rounded-full"></div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative w-full px-4 sm:px-8 shrink-0 transition-opacity duration-500 opacity-100">
                {/* Timeline Wrapper */}
                <div className="flex w-full relative pt-6 z-20">
                  <div className="hidden sm:block w-64 shrink-0"></div>
                  <div className="flex-1 relative border-b border-transparent">
                    <TimelineRuler duration={data.metadata.duration} />
                  </div>
                </div>

                {/* Tracks Stack */}
                <div className="flex flex-col relative z-10 -mt-2 pb-10">
                  {data.active_stems.map((stem) => {
                    const hasSolo = Object.values(stemStates).some(s => s?.soloed);
                    const state = stemStates[stem];
                    const isEffectivelyMuted = state?.muted || (hasSolo && !state?.soloed);

                    return (
                      <StemTrack
                        key={stem}
                        id={stem}
                        name={formatStemName(stem)}
                        muted={isEffectivelyMuted}
                        soloed={state?.soloed || false}
                        volume={state?.volume ?? 80}
                        peaks={stemPeaks[stem]}
                        onMuteToggle={() => toggleMute(stem)}
                        onSoloToggle={() => toggleSolo(stem)}
                        onVolumeChange={(e) => changeStemVolume(stem, e.target.value)}
                      />
                    );
                  })}
                </div>

                {/* Glowing Playhead Vertical Line overlaying exactly over Timeline and Tracks */}
                {data.metadata.duration > 0 && (
                  <div className="absolute top-[44px] bottom-[40px] left-0 right-0 pointer-events-none z-30 flex px-4 sm:px-8">
                    <div className="hidden sm:block w-64 shrink-0"></div>
                    <div className="flex-1 relative">
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                        style={{ left: `calc(${(currentTime / (audioBuffers.current?.[data.active_stems[0]]?.duration || data.metadata.duration)) * 100}% - 1px)` }}
                      >
                        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-[3px] border-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomAudioPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={data.metadata.duration}
        volume={isGlobalMuted ? 0 : globalVolume}
        isLyricsView={isLyricsView}
        onPlayPause={togglePlay}
        onSeek={handleSeek}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onVolumeChange={(e) => {
          setGlobalVolume(parseInt(e.target.value, 10));
          if (isGlobalMuted) setIsGlobalMuted(false);
        }}
        onVolumeToggle={() => setIsGlobalMuted(!isGlobalMuted)}
        onLyricsToggle={() => setIsLyricsView(!isLyricsView)}
        stemsReady={stemsReady}
        isRepeating={isRepeating}
        onRepeatToggle={() => {
          const next = !isRepeating;
          setIsRepeating(next);
          isRepeatingRef.current = next;
        }}
      />
    </DashboardLayout>
  );
};

export default TrackSeparationPage;
