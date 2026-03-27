import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import AudioPlayerCard from '../components/audio-enhancer/AudioPlayerCard';
import TranscriptionSection from '../components/audio-enhancer/TranscriptionSection';
import { getSpeechResults, getUserJobs } from '../services/api';
import { Loader2 } from 'lucide-react';

const AudioEnhancerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let activeJobId = jobId;

        if (!activeJobId) {
          const history = await getUserJobs();
          const speechJobs = history.jobs?.filter(j => j.job_type === 'speech' && j.status === 'completed');
          
          if (speechJobs && speechJobs.length > 0) {
            activeJobId = speechJobs[0].id;
          } else {
            setError('No session ID provided. Please start a new session from the Dashboard.');
            setLoading(false);
            return;
          }
        }

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
      setCurrentTime(Math.max(0, Math.min(timeVal, data.metadata.duration)));
    }
  };

  const handleSkipBack = () => setCurrentTime(prev => Math.max(0, prev - 10));
  const handleSkipForward = () => setCurrentTime(prev => {
    if (!data) return prev;
    return Math.min(data.metadata.duration, prev + 10);
  });

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

  // Base URL from env for download link binding
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  // Update downloads to contain full URLs
  const fullUrlDownloads = {
    clean_audio: data?.downloads?.clean_audio ? `${baseURL}${data.downloads.clean_audio}` : '#',
    transcript_txt: data?.downloads?.transcript_txt ? `${baseURL}${data.downloads.transcript_txt}` : '#',
    transcript_json: data?.downloads?.transcript_json ? `${baseURL}${data.downloads.transcript_json}` : '#',
    transcript_srt: data?.downloads?.transcript_srt ? `${baseURL}${data.downloads.transcript_srt}` : '#'
  };

  const safeMetadata = data?.metadata || { filename: 'Audio Session', duration: 0, transcript: [] };

  return (
    <DashboardLayout>
      <div className="max-w-[70rem] mx-auto py-10 px-6 sm:px-10 lg:px-12 w-full">
        <div className="mb-0 sm:mb-8 pl-1">
          <h1 className="text-2xl sm:text-[32px] font-display font-bold text-slate-900 mb-2 leading-tight tracking-tight">Audio Enhancement Result</h1>
          <p className="text-[15px] font-medium text-slate-500">Your studio-quality audio is ready.</p>
        </div>

        <div className="space-y-8 pb-12 mt-6 sm:mt-0">
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
            downloadUrl={fullUrlDownloads.clean_audio}
          />

          <TranscriptionSection 
            transcript={safeMetadata.transcript || []}
            currentTime={currentTime}
            downloads={fullUrlDownloads}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AudioEnhancerPage;
