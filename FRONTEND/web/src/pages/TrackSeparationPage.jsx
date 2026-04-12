import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Header from '../components/track-separation/Header';
import TimelineRuler from '../components/track-separation/TimelineRuler';
import StemTrack from '../components/track-separation/StemTrack';
import LyricsView from '../components/track-separation/LyricsView';
import BottomAudioPlayer from '../components/track-separation/BottomAudioPlayer';
import { getMusicResults, getUserJobs } from '../services/api';
import { Loader2 } from 'lucide-react';


const formatStemName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const TrackSeparationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLyricsView, setIsLyricsView] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(80);
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);

  const [stemStates, setStemStates] = useState({});
  const [stemUrls, setStemUrls] = useState({});
  const [stemsReady, setStemsReady] = useState(false);
  const audioRefs = React.useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let activeJobId = jobId;

        if (!activeJobId) {
          const history = await getUserJobs();
          const musicJobs = history.jobs?.filter(j => j.job_type === 'music' && j.status === 'completed');

          if (musicJobs && musicJobs.length > 0) {
            activeJobId = musicJobs[0].id;
          } else {
            setError('No session ID provided. Please start a new session from the Dashboard.');
            setLoading(false);
            return;
          }
        }

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

        const initialStems = (result.active_stems || []).reduce((acc, stem) => {
          acc[stem] = { muted: false, soloed: false, volume: 80 };
          return acc;
        }, {});
        setStemStates(initialStems);

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Fetch Blobs sequentially to avoid ngrok connection limits freezing the UI
  useEffect(() => {
    if (!data?.active_stems) return;

    let isMounted = true;
    const localUrls = [];

    const loadBlobs = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      for (const stem of data.active_stems) {
        try {
          const stemPath = data.stems[stem]?.url;
          const fullUrl = `${baseURL}${stemPath}`;

          const res = await fetch(fullUrl, { headers: { 'ngrok-skip-browser-warning': 'true' } });

          if (!res.ok) throw new Error("Fetch failed");
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          localUrls.push(objUrl);

          // Update progressively so stems appear as they finish downloading
          if (isMounted) {
            setStemUrls(prev => ({ ...prev, [stem]: objUrl }));
          }
        } catch (e) {
          console.error("Stem load error", stem, e);
          if (isMounted) {
            setError("Audio files are no longer on the server (they expire temporarily). Please upload this track again.");
          }
        }
      }
      if (isMounted) setStemsReady(true);
    };

    loadBlobs();

    return () => {
      isMounted = false;
      localUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [data]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    // Play immediately to capture the user gesture
    Object.keys(stemUrls).forEach(stem => {
      const audio = audioRefs.current[stem];
      if (audio) {
        if (nextState) {
          if (Math.abs(audio.currentTime - currentTime) > 0.5) {
            audio.currentTime = currentTime;
          }
          if (audio.readyState >= 2) {
            audio.play().catch(e => console.error("Play error:", e));
          } else {
            audio.addEventListener('canplay', () => {
              audio.play().catch(e => console.error("Play error:", e));
            }, { once: true });
          }
        } else {
          audio.pause();
        }
      }
    });
  };

  // Keep interval checking separate and robust
  useEffect(() => {
    let interval;
    if (isPlaying && data) {
      interval = setInterval(() => {
        const firstStem = data.active_stems[0];
        const primaryAudio = audioRefs.current[firstStem];

        if (primaryAudio && !primaryAudio.paused) {
          setCurrentTime(primaryAudio.currentTime);
          if (primaryAudio.ended) setIsPlaying(false);
        } else {
          setCurrentTime((prev) => {
            if (prev >= (data.metadata.duration || 100)) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 0.1;
          });
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data]);

  // Handle live Dynamic Volumes, Mutings, Soloing Overrides
  useEffect(() => {
    if (!data) return;
    const hasSolo = Object.values(stemStates).some(s => s.soloed);

    data.active_stems.forEach(stem => {
      const audio = audioRefs.current[stem];
      if (audio) {
        const isEffectivelyMuted = stemStates[stem].muted || (hasSolo && !stemStates[stem].soloed) || isGlobalMuted;
        const stemVol = stemStates[stem].volume / 100;
        const masterVol = globalVolume / 100;
        audio.volume = isEffectivelyMuted ? 0 : (stemVol * masterVol);
      }
    });
  }, [stemStates, globalVolume, isGlobalMuted, data, stemUrls]);

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
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.currentTime = clamped;
      });
    }
  };

  const handleSkipBack = () => handleSeek(currentTime - 10);
  const handleSkipForward = () => handleSeek(currentTime + 10);

  const handleExport = () => {
    if (!data) return;
    const activeStemNames = Object.keys(stemStates).filter(stem => !stemStates[stem].muted);
    const content = `Jexy Export\n\nJob ID: ${data.job_id}\nFilename: ${data.metadata.filename}\nActive Stems: ${activeStemNames.join(', ')}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jexy_export_${data.metadata.filename.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      <div className="flex flex-col h-full relative" style={{ paddingBottom: '160px' }}>
        <Header
          filename={data.metadata.filename}
          bpm={data.metadata.bpm}
          onExport={handleExport}
        />

        {/* Global hidden audio elements to persist playback across views (Fixes Bug 2 & 3) */}
        <div className="hidden">
          {data?.active_stems?.map((stem) => {
            const audioUrl = stemUrls[stem];
            if (!audioUrl) return null;
            return (
              <audio
                key={`audio-${stem}`}
                ref={el => audioRefs.current[stem] = el}
                src={audioUrl}
                preload="auto"
              />
            );
          })}
        </div>

        {isLyricsView ? (
          <LyricsView lyrics={data.metadata.lyrics?.timestamped || []} currentTime={currentTime} />
        ) : (
          <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative pb-48">
            {stemsReady ? (
              <div className="relative w-full px-4 sm:px-8 shrink-0">
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
                  const isEffectivelyMuted = stemStates[stem]?.muted || (hasSolo && !stemStates[stem]?.soloed);

                  return (
                    <StemTrack
                      key={stem}
                      id={stem}
                      name={formatStemName(stem)}
                      muted={isEffectivelyMuted}
                      soloed={stemStates[stem]?.soloed || false}
                      volume={stemStates[stem]?.volume ?? 80}
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
                      className="absolute top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)] transition-all duration-75 ease-linear"
                      style={{ left: `calc(${(currentTime / data.metadata.duration) * 100}% - 1px)` }}
                    >
                      <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-[3px] border-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[40vh]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                <p className="text-slate-500 text-sm">
                  Loading stems...
                </p>
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
      />
    </DashboardLayout>
  );
};

export default TrackSeparationPage;
