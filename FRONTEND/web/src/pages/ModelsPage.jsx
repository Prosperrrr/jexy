import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import FadeIn from '../components/FadeIn';
import { Cpu, Music, Mic, Layers, Zap, Filter, FileText, Activity } from 'lucide-react';
import { InteractiveStems, KaraokeSyncVisual } from '../components/FeatureSections';
import { motion } from 'framer-motion';

const NoiseSuppressionGraph = () => {
  const generateData = (type) => {
    const points = [];
    for (let i = 0; i < 200; i++) {
      const x = i;
      let y = 0;
      const isSpeech = (i > 15 && i < 35) || (i > 65 && i < 80) || (i > 105 && i < 135) || (i > 155 && i < 185);
      
      if (type === 'raw') {
        y = (Math.random() - 0.5) * 80 + (isSpeech ? (Math.random() - 0.5) * 60 : 0);
      } else if (type === 'jexy') {
        y = isSpeech ? (Math.random() - 0.5) * 90 : (Math.random() - 0.5) * 5;
      } else if (type === 'adobe') {
        y = isSpeech ? (Math.random() - 0.5) * 70 : (Math.random() - 0.5) * 20;
      }
      points.push(`${x},${50 + y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="flex flex-col gap-3 w-full relative z-10 bg-slate-50/50 dark:bg-[#0a0a0a]/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 text-center">
        Jexy Output vs Adobe Podcast
      </div>
      
      {/* Raw Input */}
      <div className="bg-white dark:bg-[#151515] rounded-xl p-4 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className="text-xs font-medium text-slate-500">Raw Input: Noisy Audio</span>
        </div>
        <svg viewBox="0 0 200 100" className="w-full h-16 relative z-10" preserveAspectRatio="none">
          <polyline points={generateData('raw')} fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.8" />
        </svg>
      </div>
      
      {/* Jexy Output */}
      <div className="bg-white dark:bg-[#151515] rounded-xl p-4 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-md">
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className="text-xs font-medium text-slate-500">Jexy Output</span>
        </div>
        <svg viewBox="0 0 200 100" className="w-full h-16 relative z-10" preserveAspectRatio="none">
          <polyline points={generateData('jexy')} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Adobe Output */}
      <div className="bg-white dark:bg-[#151515] rounded-xl p-4 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className="text-xs font-medium text-slate-500">Adobe Podcast Output</span>
        </div>
        <svg viewBox="0 0 200 100" className="w-full h-16 relative z-10" preserveAspectRatio="none">
          <polyline points={generateData('adobe')} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
};

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-8">
              The Engine Behind <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">The Magic.</span>
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* YAMNet Section */}
      <section className="py-24 relative bg-slate-50 dark:bg-[#0f0f0f] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
            <FadeIn direction="left" delay={0.2}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">YAMNet — Intelligent Audio Router</h2>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-medium">Zero-click classification</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                Jexy uses Google's YAMNet convolutional neural network to analyze every uploaded file before processing begins. Trained on Google's AudioSet over 2 million human-labeled audio clips YAMNet generates probability scores across 521 audio classes every 0.96 seconds.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Jexy aggregates these scores into two custom groups: Music (55 classes) and Speech (21 classes). The category with the highest cumulative score wins and the file is routed upon user confirmation.
              </p>
              <div className="flex items-center gap-4 p-4 mt-8 bg-white dark:bg-[#151515] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">521 audio classes</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">distilled into 1 routing decision</div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="right" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl opacity-50"></div>
              <div className="relative bg-white dark:bg-[#151515] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>MUSIC</span>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">75%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} transition={{ duration: 1.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true }} className="h-full bg-purple-500 rounded-full"></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>SPEECH</span>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">25%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '25%' }} transition={{ duration: 1.5, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true }} className="h-full bg-emerald-500 rounded-full"></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Demucs Section */}
      <section className="py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" delay={0.2}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Demucs htdemucs_6s — Studio-Grade Stem Separation</h2>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-medium">Waveform-based source separation</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                For music processing, Jexy uses Meta's Demucs htdemucs_6s a hybrid transformer architecture that operates directly on raw audio waveforms. Unlike older separation models that rely purely on spectrogram analysis, Demucs combines both time-domain and frequency-domain processing to achieve superior harmonic separation.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                It isolates 6 individual stems from any mixed track: vocals, drums, bass, guitar, piano, and other instruments. Each stem is independently controllable — mute, solo, adjust volume, or download individually.
              </p>
              <div className="flex items-center gap-4 p-4 mt-8 bg-slate-50 dark:bg-[#0f0f0f] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">6 stems extracted</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">from any mixed track</div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-[2rem] blur-2xl opacity-50"></div>
              <div className="relative">
                <InteractiveStems />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* DeepFilterNet Section */}
      <section className="py-24 relative bg-slate-50 dark:bg-[#0f0f0f] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
            <FadeIn direction="left" delay={0.2}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Filter className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">DeepFilterNet AI Noise Suppression</h2>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-medium">Full-band speech enhancement</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                For speech processing, Jexy uses DeepFilterNet3 a deep learning model specifically designed for real-world noise suppression. It operates in the frequency domain, estimating spectral masks that aggressively suppress broadband environmental interference traffic, rain, fan noise, crowd ambience while preserving the natural characteristics of the speaker's voice.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Unlike simple noise gates that cut audio below a threshold, DeepFilterNet understands the difference between noise and speech at a fundamental frequency level, recovering speech boundaries that would otherwise be lost.
              </p>
              <div className="flex items-center gap-4 p-4 mt-8 bg-white dark:bg-[#151515] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Achieved 22.92% WER improvement</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">in chaotic traffic environments</div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="right" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-2xl opacity-50"></div>
              <div className="relative">
                <NoiseSuppressionGraph />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Whisper Section */}
      <section className="py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" delay={0.2}>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Whisper — Automated Transcription</h2>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-medium">Speech to synchronized text</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">
                Jexy uses OpenAI's Whisper automatic speech recognition model for transcription. Whisper is a transformer-based encoder-decoder model trained on 680,000 hours of multilingual audio making it robust to accents, background noise, and varied speaking styles.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                In Jexy's pipeline, Whisper receives clean audio either the isolated vocal stem from Demucs or the enhanced speech from DeepFilterNet ensuring maximum transcription accuracy. The output is a fully timestamped transcript synchronized to the audio timeline, exportable as TXT, JSON, or SRT subtitle files.
              </p>
              <div className="flex items-center gap-4 p-4 mt-8 bg-slate-50 dark:bg-[#0f0f0f] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Trained on 680,000 hours</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">of multilingual audio</div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-[2rem] blur-2xl opacity-50"></div>
              <div className="relative">
                <KaraokeSyncVisual />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
