/* eslint-disable no-unused-vars */
import FadeIn from './FadeIn';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  "Separate",
  "Enhance",
  "Transcribe",
  "Mix",
  "Master"
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
          className="orb w-14 h-14 md:w-32 md:h-32 left-[2%] md:left-[8%] top-[15%] animate-float-slow opacity-60"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.3), rgba(255, 255, 255, 0.9))' }}
        >
          <span className="material-symbols-outlined text-xl md:text-3xl text-slate-700 dark:text-slate-300">graphic_eq</span>
        </div>
        <div
          className="orb w-12 h-12 md:w-28 md:h-28 right-[2%] md:right-[5%] top-[25%] animate-float opacity-50"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), rgba(255, 255, 255, 0.9))' }}
        >
          <span className="material-symbols-outlined text-lg md:text-3xl text-slate-700 dark:text-slate-300">piano</span>
        </div>
        <div className="orb w-10 h-10 md:w-24 md:h-24 left-[8%] md:left-[12%] bottom-[15%] animate-float-delayed opacity-40 hidden sm:flex">
          <span className="material-symbols-outlined text-base md:text-2xl text-slate-700 dark:text-slate-300">category</span>
        </div>
        <div
          className="orb w-16 h-16 md:w-36 md:h-36 right-[5%] md:right-[15%] bottom-[10%] animate-float-slow opacity-30"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(20, 184, 166, 0.15), rgba(255, 255, 255, 0.8))' }}
        >
          <span className="material-symbols-outlined text-xl md:text-3xl text-slate-700 dark:text-slate-300">filter_alt</span>
        </div>
        <div className="orb w-14 h-14 md:w-20 md:h-20 left-[1%] md:left-[3%] top-[50%] animate-float opacity-20 hidden md:flex">
          <span className="material-symbols-outlined text-xl text-slate-700 dark:text-slate-300">code</span>
        </div>
        <div className="orb w-18 h-18 md:w-22 md:h-22 right-[1%] md:right-[3%] top-[60%] animate-float-delayed opacity-20 hidden md:flex">
          <span className="material-symbols-outlined text-xl text-slate-700 dark:text-slate-300">waves</span>
        </div>
      </div>

      <FadeIn delay={0.2} direction="up" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">

        <h1 className="text-[14vw] leading-none sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-medium tracking-tight sm:tracking-tighter mb-4 sm:mb-6 flex flex-col items-center justify-center">
          <span className="block min-h-[1.1em] mb-1 sm:mb-2 inline-grid items-center align-middle w-full">
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
          <span className="text-slate-400 dark:text-slate-500 flex flex-col sm:inline sm:flex-none w-full text-center sm:text-left leading-tight mt-1 sm:mt-0 text-[10vw] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <span className="block sm:inline">your audio,</span>
            <span className="block sm:inline sm:ml-4">instantly.</span>
          </span>
        </h1>
        <p className="mt-6 text-[15px] sm:text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed px-8 sm:px-4">
          The AI-powered audio studio in your browser. Upload any song or voice recording, and let <span className="font-display font-bold tracking-tight">jexy</span> automatically separate stems, remove background noise, and transcribe every word.
        </p>
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-6 sm:px-0">
          <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-base font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-md">
            Start Creating
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <a href="https://github.com/Prosperrrr/jexy" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-medium text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
