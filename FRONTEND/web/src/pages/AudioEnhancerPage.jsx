import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import posthog from 'posthog-js';
import DashboardLayout from '../components/DashboardLayout';
import AudioPlayerCard from '../components/audio-enhancer/AudioPlayerCard';
import TranscriptionSection from '../components/audio-enhancer/TranscriptionSection';
import SessionHistory from '../components/dashboard/SessionHistory';
import Header from '../components/track-separation/Header';
import BottomAudioPlayer from '../components/track-separation/BottomAudioPlayer';
import { getSpeechResults } from '../services/api';
import { Loader2 } from 'lucide-react';

const AudioEnhancerPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobId = location.state?.jobId || queryParams.get('jobId');
  const stateFilename = location.state?.filename;

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
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLyricsView, setIsLyricsView] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [duration, setDuration] = useState(0);

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

        const result = await getSpeechResults(activeJobId);
        setData(result);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Artificial interval removed since AudioPlayerCard's internal audio <timeUpdate> handles progress tracking natively!

  const handleSeek = (timeVal) => {
    if (data) {
      setCurrentTime(Math.max(0, timeVal));
    }
  };

  useEffect(() => {
    if (data?.metadata?.duration) {
      setDuration(data.metadata.duration);
    }
  }, [data]);

  const handleSkipBack = () => setCurrentTime(prev => Math.max(0, prev - 10));
  const handleSkipForward = () => setCurrentTime(prev => {
    return prev + 10;
  });

  if (showHistory) {
    return (
      <DashboardLayout activeTab="enhance">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <SessionHistory 
              title="Speech History"
              filterType="speech" 
              emptyTitle="No Speech History Found" 
              emptyMessage="You haven't enhanced any audio yet. Process a speech file on the dashboard to get started." 
              emptyAction={{ label: 'Back to Dashboard', onClick: () => navigate('/dashboard') }}
            />
         </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
          {/* Header Skeleton */}
          <div className="h-[76px] shrink-0 border-b border-slate-200/50 bg-white/50 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <div className="w-48 h-5 bg-slate-200/70 rounded-md animate-pulse"></div>
              <div className="w-24 h-3 bg-slate-200/70 rounded-md animate-pulse"></div>
            </div>
            <div className="w-28 h-9 bg-slate-200/70 rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 pb-32">
            <div className="max-w-5xl mx-auto flex flex-col space-y-6">
              {/* AudioPlayerCard Skeleton */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col space-y-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-8 h-8 bg-blue-200/50 rounded-full"></div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="w-1/3 h-5 bg-slate-200/70 rounded-md"></div>
                    <div className="w-1/4 h-3 bg-slate-200/70 rounded-md"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-slate-100 rounded-xl"></div>
              </div>

              {/* TranscriptionSection Skeleton */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col animate-pulse">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="w-32 h-6 bg-slate-200/70 rounded-md"></div>
                  <div className="w-24 h-8 bg-slate-200/70 rounded-full"></div>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="w-full h-4 bg-slate-100 rounded-md"></div>
                  <div className="w-5/6 h-4 bg-slate-100 rounded-md"></div>
                  <div className="w-4/6 h-4 bg-slate-100 rounded-md"></div>
                  <div className="w-full h-4 bg-slate-100 rounded-md mt-6"></div>
                  <div className="w-3/4 h-4 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* BottomAudioPlayer Skeleton */}
          <div className="h-[90px] shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200/50 px-4 sm:px-8 flex items-center justify-between animate-pulse fixed bottom-0 left-0 w-full z-40 lg:w-[calc(100%-256px)] lg:left-64">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200/70 rounded-full"></div>
              <div className="hidden sm:block w-32 h-4 bg-slate-200/70 rounded-md"></div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-8 h-8 bg-slate-200/70 rounded-full"></div>
              <div className="w-12 h-12 bg-slate-200/70 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-200/70 rounded-full"></div>
            </div>
            <div className="hidden md:flex items-center space-x-3 w-48">
              <div className="w-5 h-5 bg-slate-200/70 rounded-md"></div>
              <div className="w-full h-2 bg-slate-200/70 rounded-full"></div>
            </div>
          </div>
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

  // Base URL from env for download link binding
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const resolveUrl = (url) => {
    if (!url || url === '#') return '#';
    return url.startsWith('http') ? url : `${baseURL}${url}`;
  };

  const fullUrlDownloads = {
    clean_audio: resolveUrl(data?.downloads?.clean_audio),
    transcript_txt: resolveUrl(data?.downloads?.transcript_txt),
    transcript_json: resolveUrl(data?.downloads?.transcript_json),
    transcript_srt: resolveUrl(data?.downloads?.transcript_srt),
  };

  const safeMetadata = data?.metadata || { filename: 'Audio Session', duration: 0, transcript: [] };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/audio-enhancer?jobId=${jobId}`;
    const shareData = {
      title: 'Jexy Enhanced Audio',
      text: `Listen to enhanced audio for ${safeMetadata.filename || 'Session'}`,
      url: shareUrl,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareUrl);
      }
    } catch (err) {
      console.log('Share failed', err);
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        <Header
          filename={safeMetadata.filename}
          subtitle="Enhanced Audio"
          downloadText="Download"
          onExport={() => {
            const link = document.createElement('a');
            link.href = fullUrlDownloads.clean_audio;
            link.download = `jexy_enhanced_${safeMetadata.filename || 'audio'}`;
            link.click();
            posthog?.capture('Export Enhanced Audio');
          }}
          isExporting={false}
          onShare={handleShare}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth pb-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6">
            <div className="flex flex-col space-y-6">
              <AudioPlayerCard
                metadata={safeMetadata}
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
                onDurationChange={(dur) => setDuration(dur)}
                downloadUrl={fullUrlDownloads.clean_audio}
                isRepeating={isRepeating}
              />
              <TranscriptionSection 
                transcript={safeMetadata.transcript || []} 
                currentTime={currentTime}
                filename={safeMetadata.filename || stateFilename}
              />
              {/* Transcription Disclaimer */}
              <div className="pt-2 pb-8 text-center sm:text-left">
                <p className="text-slate-400 dark:text-slate-500 text-sm italic font-medium">
                  Note: The transcription might not be 100% accurate. The AI model can occasionally make mistakes or misinterpret words.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomAudioPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={isMuted ? 0 : volume}
        isLyricsView={isLyricsView}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onSeek={handleSeek}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onVolumeChange={(e) => {
          setVolume(parseInt(e.target.value, 10));
          if (isMuted) setIsMuted(false);
        }}
        onVolumeToggle={() => setIsMuted(!isMuted)}
        onLyricsToggle={() => setIsLyricsView(!isLyricsView)}
        stemsReady={true}
        isRepeating={isRepeating}
        onRepeatToggle={() => setIsRepeating(!isRepeating)}
        hideLeftToggle={true}
      />
    </DashboardLayout>
  );
};

export default AudioEnhancerPage;
