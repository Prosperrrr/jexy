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
        setData(result);
        
        const initialStems = result.active_stems.reduce((acc, stem) => {
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

  useEffect(() => {
    let interval;
    if (isPlaying && data) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= data.metadata.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data]);

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
      setCurrentTime(Math.max(0, Math.min(timeVal, data.metadata.duration)));
    }
  };

  const handleSkipBack = () => setCurrentTime(prev => Math.max(0, prev - 10));
  const handleSkipForward = () => setCurrentTime(prev => {
    if (!data) return prev;
    return Math.min(data.metadata.duration, prev + 10);
  });

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
        
        {isLyricsView ? (
          <LyricsView lyrics={data.metadata.lyrics || []} currentTime={currentTime} />
        ) : (
          <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative pb-48">
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
                  const hasSolo = Object.values(stemStates).some(s => s.soloed);
                  const isEffectivelyMuted = stemStates[stem].muted || (hasSolo && !stemStates[stem].soloed);
                  
                  // In a real implementation with real audio, we'd pass the actual URL to an audio element.
                  // const audioUrl = `${baseURL}${data.stems[stem].url}`;

                  return (
                    <StemTrack 
                      key={stem}
                      id={stem}
                      name={formatStemName(stem)}
                      muted={isEffectivelyMuted}
                      soloed={stemStates[stem].soloed}
                      volume={stemStates[stem].volume}
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
          </div>
        )}
      </div>
      <BottomAudioPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={data.metadata.duration}
        volume={isGlobalMuted ? 0 : globalVolume}
        isLyricsView={isLyricsView}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSeek={handleSeek}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onVolumeChange={(e) => {
          setGlobalVolume(parseInt(e.target.value, 10));
          if (isGlobalMuted) setIsGlobalMuted(false);
        }}
        onVolumeToggle={() => setIsGlobalMuted(!isGlobalMuted)}
        onLyricsToggle={() => setIsLyricsView(!isLyricsView)}
      />
    </DashboardLayout>
  );
};

export default TrackSeparationPage;
