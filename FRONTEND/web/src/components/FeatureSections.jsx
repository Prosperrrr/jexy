import React, { useState, useRef } from 'react';
import FadeIn from './FadeIn';
import { motion, useInView } from 'framer-motion';
import { Mic2, Drum, Speaker, VolumeX, Volume2 } from 'lucide-react';
import mockupWaveforms from '../data/mockupWaveforms.json';

export const InteractiveStems = () => {
  const [stems, setStems] = useState([
    { id: 'bass', name: 'Bass', icon: Speaker, muted: true, soloed: false, volume: 80, gradient: '#3b82f6', peaks: mockupWaveforms.bass },
    { id: 'drums', name: 'Drums', icon: Drum, muted: true, soloed: false, volume: 80, gradient: '#3b82f6', peaks: mockupWaveforms.drums },
    { id: 'vocals', name: 'Vocals', icon: Mic2, muted: false, soloed: true, volume: 85, gradient: '#3b82f6', peaks: mockupWaveforms.vocals }
  ]);

  const toggleMute = (id) => {
    setStems(stems.map(s => {
      if (s.id === id) {
        const newMuted = !s.muted;
        return { ...s, muted: newMuted, soloed: newMuted ? false : s.soloed };
      }
      return s;
    }));
  };

  const toggleSolo = (id) => {
    const target = stems.find(s => s.id === id);
    if (target.soloed) {
      // Turning off solo: Unmute everyone, un-solo everyone
      setStems(stems.map(s => ({ ...s, soloed: false, muted: false })));
    } else {
      // Turning on solo: Solo this one (unmute it), mute all others (un-solo them)
      setStems(stems.map(s => {
        if (s.id === id) {
          return { ...s, soloed: true, muted: false };
        }
        return { ...s, soloed: false, muted: true };
      }));
    }
  };

  const setVolume = (id, newVolume) => {
    setStems(stems.map(s => s.id === id ? { ...s, volume: newVolume } : s));
  };

  return (
    <div className="flex flex-col gap-3">
      {stems.map((stem) => {
        const Icon = stem.icon;
        const isMuted = stem.muted;
        const isSoloed = stem.soloed;
        const volume = stem.volume;

        return (
          <div key={stem.id} className={`flex ${isSoloed ? 'bg-white/70 dark:bg-slate-900/70 border-blue-200/60 dark:border-blue-900/40 shadow-xl' : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/60 dark:border-slate-700/60 shadow-sm'} backdrop-blur-xl rounded-2xl border overflow-hidden h-[72px] transition-all duration-300`}>
            <div className={`w-[150px] sm:w-[180px] shrink-0 border-r border-slate-100/50 dark:border-slate-800 p-3 flex flex-col justify-center gap-3 ${isSoloed ? 'bg-white/90 dark:bg-[#1a1a1a]' : 'bg-white/60 dark:bg-[#151515]'} transition-colors duration-300`}>
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className={`p-2 rounded-xl transition-all duration-300 shrink-0 ${isSoloed ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)]' : isMuted ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`font-display font-extrabold text-[12px] sm:text-[14px] truncate flex-1 min-w-0 transition-colors ${isSoloed ? 'text-slate-900 dark:text-white' : isMuted ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{stem.name}</span>
                <div className="flex gap-1.5 z-20 shrink-0">
                  <button onClick={() => toggleMute(stem.id)} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all ${isMuted ? 'bg-red-50 text-red-600 ring-1 ring-red-500/30 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/20 shadow-inner' : 'bg-slate-50 text-slate-400 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>M</button>
                  <button onClick={() => toggleSolo(stem.id)} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all ${isSoloed ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50' : 'bg-slate-50 text-slate-400 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>S</button>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 px-1 z-20 group">
                 {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}
                 <div className="flex-grow h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                   <div className={`absolute left-0 top-0 h-full transition-all duration-150 ${isMuted ? 'bg-slate-300 dark:bg-slate-600 w-0' : 'bg-blue-500'}`} style={{ width: `${volume}%` }}></div>
                   <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(stem.id, parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 </div>
              </div>
            </div>
            <div className={`flex-1 relative flex items-center h-full overflow-hidden transition-all duration-300 ${isMuted ? 'opacity-30 grayscale' : 'opacity-100'}`}>
               {isSoloed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 dark:via-blue-900/20 to-transparent pointer-events-none"></div>}
               <svg preserveAspectRatio="none" viewBox="0 0 1000 60" className="w-full h-14 drop-shadow-sm px-2 pointer-events-none" fill="none">
                 <defs>
                   <linearGradient id={`grad-${stem.id}`} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor={stem.gradient} stopOpacity="0.9" />
                     <stop offset="100%" stopColor={stem.gradient} stopOpacity="0.2" />
                   </linearGradient>
                 </defs>
                 <path d={(() => {
                   let d = "";
                   const numBars = stem.peaks.length;
                   const stepX = 1000 / numBars;
                   stem.peaks.forEach((peak, i) => {
                     const h = Math.max(2, peak * 44); // max height 44px
                     const x = (i * stepX + stepX / 2).toFixed(1);
                     const y = (30 - h / 2).toFixed(1);
                     d += `M ${x} ${y} v ${h.toFixed(1)} `;
                   });
                   return d;
                 })()} stroke={`url(#grad-${stem.id})`} strokeWidth={Math.max(1.5, (1000/stem.peaks.length) * 0.6)} strokeLinecap="round" className="transition-all duration-150" />
               </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SimpleDenoiseVisual = () => {
  // Generate 500 densely packed bars for a high-res, professional audio waveform
  const cleanBars = Array.from({length: 500}).map((_, i) => {
    const x = (i * 2).toFixed(1);
    
    // Base silence
    let envelope = 0;
    
    // Blob 1 (syllable)
    if (i > 50 && i < 150) {
      const norm = (i - 50) / 100;
      envelope += Math.sin(norm * Math.PI) * (30 + Math.sin(norm * Math.PI * 6) * 20);
    }
    
    // Blob 2 (multi-syllable word)
    if (i > 180 && i < 330) {
      const norm = (i - 180) / 150;
      envelope += Math.sin(norm * Math.PI) * (50 + Math.sin(norm * Math.PI * 4) * 35 + Math.cos(norm * Math.PI * 9) * 15);
    }
    
    // Blob 3 (ending syllable)
    if (i > 360 && i < 460) {
      const norm = (i - 360) / 100;
      envelope += Math.sin(norm * Math.PI) * (40 + Math.cos(norm * Math.PI * 5) * 30);
    }

    envelope = Math.max(0, envelope);
    
    // Apply highly organic high-frequency modulation so it looks like raw sound data
    if (envelope > 2) {
       envelope = envelope * (0.2 + Math.abs(Math.sin(i * 1.3)) * 0.5 + Math.random() * 0.3);
    }

    return { x, h: Math.max(1.5, envelope) };
  });

  // Calculate messy bars: Add a wandering, thick baseline noise to the entire track
  const messyBars = cleanBars.map((bar, i) => {
    // Wandering noise floor that looks more organic than pure random static
    const wanderingNoise = 20 + Math.sin(i * 0.05) * 8 + Math.cos(i * 0.02) * 5 + (Math.random() * 12);
    return {
      x: bar.x,
      // Peaks are also made more chaotic
      h: Math.max(wanderingNoise, bar.h + (Math.random() * 25))
    }
  });

  return (
    <div className="relative bg-white dark:bg-[#0f0f0f] rounded-2xl h-80 w-full flex flex-col p-6 transition-colors duration-300">
      
      {/* Labels */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase z-30 relative mb-8">
        <span className="text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">Raw Audio</span>
        <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 flex items-center gap-2">
          Enhanced
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
        </span>
      </div>

      <div className="relative flex-grow flex items-center justify-center w-full">
        
        {/* The Waveform Container */}
        <div className="relative w-full h-32 flex overflow-hidden rounded-xl">
          
          {/* Background Layer: Noisy */}
          <div className="absolute inset-y-0 left-0 w-full h-full">
            <svg preserveAspectRatio="none" viewBox="0 0 1000 100" className="absolute top-0 left-0 w-full h-full max-w-none" fill="none">
              {/* Dense realistic noisy waveform */}
              <path d={messyBars.map((bar) => `M ${bar.x} ${(50 - bar.h/2).toFixed(1)} v ${bar.h.toFixed(1)} `).join('')} stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            </svg>
          </div>

          {/* Foreground Layer: Clean (Wipes in from right to center) */}
          <motion.div 
            className="absolute inset-y-0 left-0 w-full h-full bg-white dark:bg-[#0f0f0f]"
            initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 50%)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
            
            <svg preserveAspectRatio="none" viewBox="0 0 1000 100" className="absolute top-0 left-0 w-full h-full max-w-none drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" fill="none">
               <defs>
                <linearGradient id="grad-clean-simple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d={cleanBars.map((bar) => `M ${bar.x} ${(50 - bar.h/2).toFixed(1)} v ${bar.h.toFixed(1)} `).join('')} stroke="url(#grad-clean-simple)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* The Animated Wiping Divider */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center justify-center h-48 z-20"
            initial={{ left: "100%" }}
            whileInView={{ left: "50%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-300 dark:via-blue-600 to-transparent"></div>
            <div className="absolute w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export const KaraokeSyncVisual = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-20%" });
  
  const lines = [
    { text: "He's putting on a drum show", duration: 3000 },
    { text: "Even now, even now, even now", duration: 4000 },
    { text: "He'll take the longer way home", duration: 3500 },
    { text: "Even now, even now, even now", duration: 4500 },
    { text: "He'll never ever say so", duration: 3500 },
    { text: "He tries fastest to feel it, feel it", duration: 3000 }
  ];

  React.useEffect(() => {
    if (!isInView) {
      setActiveIndex(0);
      return;
    }

    let timeoutId;
    const playNext = (index) => {
      setActiveIndex(index);
      const nextIndex = (index + 1) % lines.length;
      timeoutId = setTimeout(() => playNext(nextIndex), lines[index].duration);
    };
    
    // Start loop
    timeoutId = setTimeout(() => playNext(1), lines[0].duration);
    
    return () => clearTimeout(timeoutId);
  }, [isInView]);

  React.useEffect(() => {
    if (activeIndex !== -1 && scrollRef.current && scrollRef.current.parentElement) {
      const activeElement = scrollRef.current.children[activeIndex];
      const parent = scrollRef.current.parentElement;
      if (activeElement && parent) {
        const targetScrollTop = activeElement.offsetTop - parent.clientHeight / 2 + activeElement.clientHeight / 2;
        parent.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl w-full h-[320px] sm:h-96 flex flex-col p-6 sm:p-8 transition-colors duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      
      {/* Label */}
      <div className="mt-2 mb-4 z-10 relative flex justify-between items-center">
        <span className="text-slate-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono uppercase border border-slate-200 dark:border-slate-800 shadow-sm">
          Lyrics
        </span>
      </div>

      {/* Karaoke Lyrics (Native Scroll to match actual interface) */}
      <div className="flex-1 overflow-y-hidden relative w-full flex flex-col text-left mt-2" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
        <div 
          className="w-full pb-[150px] pt-[80px] relative z-10 flex flex-col space-y-4 px-2"
          ref={scrollRef}
        >
          {lines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            return (
              <p 
                key={idx}
                className={`font-display transition-all duration-500 ease-out tracking-tight
                  ${isActive 
                    ? 'text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-500 scale-[1.01] origin-left' 
                    : isPast
                      ? 'text-xl sm:text-2xl text-slate-400/50 dark:text-slate-500/50 font-medium'
                      : 'text-xl sm:text-2xl text-slate-400 dark:text-slate-500 font-medium'}
                `}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* Decorative Elements & Attribution */}
      <div className="absolute -right-8 -bottom-12 opacity-[0.03] dark:opacity-5 pointer-events-none select-none">
         <span className="text-[200px] font-black text-slate-900 dark:text-white leading-none">♪</span>
      </div>
      <div className="absolute bottom-4 right-6 z-20">
        <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-medium italic flex items-center gap-1.5 bg-slate-50 dark:bg-[#0f0f0f] p-1 rounded">
          <span className="text-blue-500">♪</span> Drum show - Twenty One pilots
        </span>
      </div>

    </div>
  );
};

export default function FeatureSections() {
  return (
    <>
      <section className="relative py-24 bg-white dark:bg-black transition-colors duration-300 overflow-hidden w-full max-w-[100vw]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Section 1: Auto-Detection (Text Left, Visual Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-20 md:mb-32">
            <FadeIn direction="right" delay={0.2}>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Intelligent Classification</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Zero-Click Auto-Detection</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                You never have to configure settings before uploading. <span className="font-display font-bold tracking-tight">jexy</span> analyzes your audio in real-time. If it hears a song, it routes to Track Separation. If it hears a podcast or voice note, it routes to Speech Enhancement. Just upload, and let the AI do the heavy lifting.
              </p>
            </FadeIn>

            <FadeIn direction="left" delay={0.4} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>SPEECH CONFIDENCE</span>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">79%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '79%' }} transition={{ duration: 1.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true }} className="h-full bg-emerald-500 rounded-full"></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
                      <span>MUSIC CONFIDENCE</span>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">21%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '21%' }} transition={{ duration: 1.5, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }} viewport={{ once: true }} className="h-full bg-purple-500 rounded-full"></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Section 2: DAW Interface (Visual Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-20 md:mb-32">
            <FadeIn direction="right" delay={0.4} className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-2 border border-slate-200 dark:border-slate-800">
                <InteractiveStems />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="order-1 lg:order-2 relative w-full">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Track Separation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">A DAW-Style Experience in Your Browser</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Forget clunky desktop software. <span className="font-display font-bold tracking-tight">jexy</span> gives you a beautiful, timeline-based interface with waveform visualization. Create custom volume mixes, solo specific instruments, and export exactly what you hear.
              </p>
            </FadeIn>
          </div>

          {/* Section 3: Speech Enhancement (Text Left, Visual Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-20 md:mb-32">
            <FadeIn direction="right" delay={0.2} className="relative w-full">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Speech Enhancement</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Crystal Clear Denoising</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                <span className="font-display font-bold tracking-tight">jexy</span> removes background noise, wind, and room echo. Whether you're recording a podcast in a noisy area or a voice note on the street, your audio comes out sounding like it was recorded in a professional studio.
              </p>
            </FadeIn>

            <FadeIn direction="left" delay={0.4}>
              <div className="relative rounded-2xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 p-2 overflow-hidden shadow-sm">
                <SimpleDenoiseVisual />
              </div>
            </FadeIn>
          </div>

          {/* Section 4: Lyrics Extraction (Visual Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-20 md:mb-32">
            <FadeIn direction="right" delay={0.4} className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-[2rem] blur-xl opacity-50"></div>
              <KaraokeSyncVisual />
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="order-1 lg:order-2 relative w-full">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Time-Synced Lyrics</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">AI Lyrics Extraction</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Instantly generate time-synced lyrics and transcripts from your audio. Export to standard formats like JSON, SRT, or TXT for closed captions, or just use it to follow along with the beat.
              </p>
            </FadeIn>
          </div>

          {/* Section 5: Cloud Processing (Text Left, Visual Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-20 md:mb-32">
            <FadeIn direction="right" delay={0.2} className="order-1 lg:order-1 relative w-full">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="inline-block px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 rounded-full">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Cloud Infrastructure</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Cloud-Powered Processing</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                <span className="font-display font-bold tracking-tight">jexy</span> runs entirely in the cloud. No software to install, no expensive hardware required. Upload your file and get professional results in minutes, from any device.
              </p>
            </FadeIn>

            <FadeIn direction="left" delay={0.4} className="order-2 lg:order-2 relative">
              <div className="relative bg-slate-50 dark:bg-[#0f0f0f] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 h-80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]"></div>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-[spin_3s_linear_infinite]"></div>
                  <div className="absolute inset-2 rounded-full border border-slate-200 dark:border-slate-800"></div>
                  <div className="absolute inset-2 rounded-full border-b-2 border-indigo-500 animate-[spin_4s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-4 rounded-full border border-slate-200 dark:border-slate-800"></div>
                  <div className="absolute inset-4 rounded-full border-l-2 border-teal-400 animate-[spin_2s_linear_infinite]"></div>
                  
                  <div className="absolute w-24 h-24 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                  <div className="z-10 bg-white dark:bg-black rounded-full w-20 h-20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-3xl text-blue-500">cloud</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>
    </>
  );
}
