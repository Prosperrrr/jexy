import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Header from '../components/track-separation/Header';
import TimelineRuler from '../components/track-separation/TimelineRuler';
import StemTrack from '../components/track-separation/StemTrack';
import LyricsView from '../components/track-separation/LyricsView';
import BottomAudioPlayer from '../components/track-separation/BottomAudioPlayer';

const MOCK_DATA = {
  job_id: "mock-123",
  status: "COMPLETE", 
  metadata: { 
    filename: "Drum Show | Naijahit.com", 
    key: "C Minor", 
    bpm: "124", 
    duration: 180, 
    sample_rate: 44100, 
    lyrics: [
      { time: 0, text: "I used to be a little boy" },
      { time: 5, text: "With a whole lot of dreams" },
      { time: 10, text: "Playing the drums for the show" },
      { time: 15, text: "Hoping one day they will know" },
      { time: 20, text: "My name across the world" },
      { time: 25, text: "And sing along to my song" },
      { time: 30, text: "Yeah, sing along to my song" }
    ], 
    processed_at: "2026-03-26T10:00:00Z" 
  },
  stems: { 
    vocals: { url: "", active: true },
    drums: { url: "", active: true },
    bass: { url: "", active: true },
    guitar: { url: "", active: true },
    piano: { url: "", active: true },
    other: { url: "", active: true }
  },
  active_stems: ["vocals", "drums", "bass", "guitar", "piano", "other"]
};

const formatStemName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const TrackSeparationPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLyricsView, setIsLyricsView] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(80);
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  
  const [stemStates, setStemStates] = useState(
    MOCK_DATA.active_stems.reduce((acc, stem) => {
      acc[stem] = { muted: false, soloed: false, volume: 80 };
      return acc;
    }, {})
  );

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= MOCK_DATA.metadata.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
    setCurrentTime(Math.max(0, Math.min(timeVal, MOCK_DATA.metadata.duration)));
  };

  const handleSkipBack = () => setCurrentTime(prev => Math.max(0, prev - 10));
  const handleSkipForward = () => setCurrentTime(prev => Math.min(MOCK_DATA.metadata.duration, prev + 10));

  const handleExport = () => {
    const activeStemNames = Object.keys(stemStates).filter(stem => !stemStates[stem].muted);
    const content = `Mock Export\n\nJob ID: ${MOCK_DATA.job_id}\nFilename: ${MOCK_DATA.metadata.filename}\nActive Stems: ${activeStemNames.join(', ')}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jexy_export_${MOCK_DATA.metadata.filename.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative" style={{ paddingBottom: '160px' }}>
        <Header 
          filename={MOCK_DATA.metadata.filename} 
          bpm={MOCK_DATA.metadata.bpm} 
          onExport={handleExport}
        />
        
        {isLyricsView ? (
          <LyricsView lyrics={MOCK_DATA.metadata.lyrics} currentTime={currentTime} />
        ) : (
          <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative pb-48">
            <div className="relative w-full px-4 sm:px-8 shrink-0">
              {/* Timeline Wrapper */}
              <div className="flex w-full relative pt-6 z-20">
                <div className="hidden sm:block w-64 shrink-0"></div>
                <div className="flex-1 relative border-b border-transparent">
                  <TimelineRuler duration={MOCK_DATA.metadata.duration} />
                </div>
              </div>
              
              {/* Tracks Stack */}
              <div className="flex flex-col relative z-10 -mt-2 pb-10">
                {MOCK_DATA.active_stems.map((stem) => {
                  const hasSolo = Object.values(stemStates).some(s => s.soloed);
                  const isEffectivelyMuted = stemStates[stem].muted || (hasSolo && !stemStates[stem].soloed);

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
              {MOCK_DATA.metadata.duration > 0 && (
                <div className="absolute top-[44px] bottom-[40px] left-0 right-0 pointer-events-none z-30 flex px-4 sm:px-8">
                  <div className="hidden sm:block w-64 shrink-0"></div>
                  <div className="flex-1 relative">
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)] transition-all duration-75 ease-linear"
                      style={{ left: `calc(${(currentTime / MOCK_DATA.metadata.duration) * 100}% - 1px)` }}
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
        duration={MOCK_DATA.metadata.duration}
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
