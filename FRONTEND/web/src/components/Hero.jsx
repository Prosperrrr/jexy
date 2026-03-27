/* eslint-disable no-unused-vars */
import FadeIn from './FadeIn';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  "Separate",
  "Transcribe",
  "Enhance",
  "Classify",
  "Perfect"
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-400/10 blur-[120px] rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
      <div className="orb-container">
        <div
          className="orb w-24 h-24 md:w-32 md:h-32 left-[2%] md:left-[8%] top-[15%] animate-float-slow opacity-60"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.3), rgba(255, 255, 255, 0.9))' }}
        >
          <span className="material-symbols-outlined text-3xl text-slate-700 dark:text-slate-300">graphic_eq</span>
        </div>
        <div
          className="orb w-20 h-20 md:w-28 md:h-28 right-[2%] md:right-[5%] top-[25%] animate-float opacity-50"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), rgba(255, 255, 255, 0.9))' }}
        >
          <span className="material-symbols-outlined text-3xl text-slate-700 dark:text-slate-300">piano</span>
        </div>
        <div className="orb w-16 h-16 md:w-24 md:h-24 left-[8%] md:left-[12%] bottom-[15%] animate-float-delayed opacity-40">
          <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-slate-300">category</span>
        </div>
        <div
          className="orb w-28 h-28 md:w-36 md:h-36 right-[5%] md:right-[15%] bottom-[10%] animate-float-slow opacity-30"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(20, 184, 166, 0.15), rgba(255, 255, 255, 0.8))' }}
        >
          <span className="material-symbols-outlined text-3xl text-slate-700 dark:text-slate-300">filter_alt</span>
        </div>
        <div className="orb w-14 h-14 md:w-20 md:h-20 left-[1%] md:left-[3%] top-[50%] animate-float opacity-20 hidden md:flex">
          <span className="material-symbols-outlined text-xl text-slate-700 dark:text-slate-300">code</span>
        </div>
        <div className="orb w-18 h-18 md:w-22 md:h-22 right-[1%] md:right-[3%] top-[60%] animate-float-delayed opacity-20 hidden md:flex">
          <span className="material-symbols-outlined text-xl text-slate-700 dark:text-slate-300">waves</span>
        </div>
      </div>

      <FadeIn delay={0.2} direction="up" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border dark:border-slate-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm mb-6 border-teal-200/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
          <span className="w-2 h-2 rounded-full animate-pulse bg-teal-400"></span>
          <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 tracking-widest uppercase">
            Open Source Academic Project
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tighter mb-6 leading-tight md:leading-[1.1]">
          <span className="block h-[1.2em] mb-2 sm:mb-4 inline-grid items-center align-middle">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={words[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-start-1 row-start-1 text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 block"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-slate-400 dark:text-slate-500 block">your audio, effortlessly.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          An experimental pipeline for audio classification, separation, enhancement, and transcription.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-lg font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-blue-50">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Run Workflow
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </span>
          </button>
          <a href="#" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">article</span>
            Read the Paper
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
