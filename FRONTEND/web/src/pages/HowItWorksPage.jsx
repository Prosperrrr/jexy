import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, Headphones, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import FadeIn from '../components/FadeIn';

export default function HowItWorksPage() {
  useEffect(() => {
    document.documentElement.style.fontSize = '14px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  const steps = [
    {
      title: "1. Upload Your Audio",
      description: "Simply drag and drop your audio or video file. We support all major formats including MP3, WAV, FLAC, and MP4.",
      icon: UploadCloud,
      color: "from-sky-400 to-blue-500",
      bgClass: "bg-sky-50 dark:bg-sky-900/10"
    },
    {
      title: "2. Cloud AI Processing",
      description: "Our proprietary neural networks instantly analyze the waveform. They separate vocal stems from instruments, or scrub out background noise with surgical precision.",
      icon: Cpu,
      color: "from-fuchsia-400 to-purple-500",
      bgClass: "bg-fuchsia-50 dark:bg-fuchsia-900/10"
    },
    {
      title: "3. Studio Quality Playback",
      description: "Listen to the results instantly in our built-in web studio. Solo the vocals, mute the bass, or compare the enhanced speech against the noisy original in real-time.",
      icon: Headphones,
      color: "from-teal-400 to-emerald-500",
      bgClass: "bg-teal-50 dark:bg-teal-900/10"
    },
    {
      title: "4. Export & Download",
      description: "Download the clean stems or enhanced audio directly to your device. Export lyrics as JSON, SRT, or TXT for immediate use in your video editing workflow.",
      icon: Download,
      color: "from-indigo-400 to-blue-600",
      bgClass: "bg-indigo-50 dark:bg-indigo-900/10"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-100/50 dark:bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn delay={0.1} direction="up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
              How <span className="font-display font-bold tracking-tight">jexy</span> Works
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              From raw upload to studio-quality isolated stems in four simple, lightning-fast steps.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-zinc-900/20 relative w-full overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2 z-0"></div>

          <div className="space-y-12 md:space-y-24 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full group">
                  {/* Step Dot (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-slate-700 items-center justify-center z-20 shadow-sm transition-colors group-hover:border-blue-400 dark:group-hover:border-blue-500">
                    <span className="font-display font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-500">{index + 1}</span>
                  </div>

                  {/* Content Container */}
                  <FadeIn 
                    direction={isEven ? "right" : "left"} 
                    delay={0.1}
                    className={`w-full md:w-[45%] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                  >
                    <div className="bg-white dark:bg-zinc-900/80 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${step.color} shadow-lg text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-3 tracking-tight">{step.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">{step.description}</p>
                    </div>
                  </FadeIn>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CallToAction />

      <Footer />
    </div>
  );
}
