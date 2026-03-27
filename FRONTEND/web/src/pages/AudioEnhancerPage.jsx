import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import AudioPlayerCard from '../components/audio-enhancer/AudioPlayerCard';
import TranscriptionSection from '../components/audio-enhancer/TranscriptionSection';

const MOCK_DATA = {
  job_id: "mock-123",
  status: "completed",
  metadata: {
    filename: "Speech File_final.wav",
    duration: 143, // 02:23
    sample_rate: "48000",
    transcript: [
      { start: 0, end: 42, text: "Welcome to the latest session of our creative deep dive. Today, we're exploring how artificial intelligence is reshaping the landscape of audio production. When we talk about noise reduction, it's not just about removing hum; it's about preserving the soul of the speaker's voice." },
      { start: 42, end: 75, text: "Traditionally, high-end studios spent hours manually gating and EQing tracks. With the new models we're seeing, that process is reduced to seconds, allowing creators to focus more on the narrative and less on the technical hurdles of a poor recording environment." },
      { start: 75, end: 118, text: "Take this recording for example. It was captured in a busy cafe with significant background chatter and reverb. Notice how the clarity of the consonants remains intact even as the ambient noise is completely neutralized. This is the power of neural network-based processing." },
      { start: 118, end: 143, text: "Looking ahead, we expect these tools to become standard in every creator's toolkit, from podcasters to documentary filmmakers. The barrier to entry for high-quality audio has never been lower." }
    ],
    processed_at: "2026-03-27T10:00:00Z"
  },
  downloads: {
    clean_audio: "#",
    transcript_txt: "#",
    transcript_json: "#",
    transcript_srt: "#"
  }
};

const AudioEnhancerPage = () => {
  const location = useLocation();
  const job_id = location.state?.job_id || MOCK_DATA.job_id;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= MOCK_DATA.metadata.duration) {
            setIsPlaying(false);
            return MOCK_DATA.metadata.duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (timeVal) => {
    setCurrentTime(Math.max(0, Math.min(timeVal, MOCK_DATA.metadata.duration)));
  };

  const handleSkipBack = () => setCurrentTime(prev => Math.max(0, prev - 10));
  const handleSkipForward = () => setCurrentTime(prev => Math.min(MOCK_DATA.metadata.duration, prev + 10));

  return (
    <DashboardLayout>
      <div className="max-w-[70rem] mx-auto py-10 px-6 sm:px-10 lg:px-12 w-full">
        <div className="mb-0 sm:mb-8 pl-1">
          <h1 className="text-2xl sm:text-[32px] font-display font-bold text-slate-900 mb-2 leading-tight tracking-tight">Audio Enhancement Result</h1>
          <p className="text-[15px] font-medium text-slate-500">Your studio-quality audio is ready.</p>
        </div>

        <div className="space-y-8 pb-12 mt-6 sm:mt-0">
          <AudioPlayerCard 
            metadata={MOCK_DATA.metadata}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            volume={isMuted ? 0 : volume}
            setVolume={(val) => {
              setVolume(parseInt(val, 10));
              if (isMuted) setIsMuted(false);
            }}
            onVolumeToggle={() => setIsMuted(!isMuted)}
            onSeek={handleSeek}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            downloadUrl={MOCK_DATA.downloads.clean_audio}
          />

          <TranscriptionSection 
            transcript={MOCK_DATA.metadata.transcript}
            currentTime={currentTime}
            downloads={MOCK_DATA.downloads}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AudioEnhancerPage;
