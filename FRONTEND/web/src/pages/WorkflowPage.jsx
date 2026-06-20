import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CallToAction from '../components/CallToAction';
import FadeIn from '../components/FadeIn';
import { Route, Zap, Download, Server, RefreshCw } from 'lucide-react';

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-8">
              Less Waiting. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">More Creating.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              <span className="font-display font-bold tracking-tight">jexy</span>'s workflow is designed to get out of your way. Upload your files, let the asynchronous task queue handle the heavy lifting, and playback and download your results.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Workflow Steps Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mb-24 relative">
            <div className="hidden md:block absolute left-[31px] top-16 bottom-[-96px] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-slate-50 dark:border-[#0a0a0a] shadow-lg flex items-center justify-center shrink-0 relative z-10">
              <Route className="w-6 h-6 text-teal-500" />
            </div>
            <FadeIn direction="up" delay={0.2} className="flex-1 bg-white dark:bg-[#121212] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-display font-medium mb-4">1. Smart Routing</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                As soon as you upload an audio file, <span className="font-display font-bold tracking-tight">jexy</span> analyzes its characteristics. Whether you drop in a lengthy podcast or a dense pop track, our routing engine automatically suggests the optimal processing pipeline (Track Separation or Speech Enhancement). Just review the classification, click confirm, and let <span className="font-display font-bold tracking-tight">jexy</span> do the rest.
              </p>
            </FadeIn>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mb-24 relative">
            <div className="hidden md:block absolute left-[31px] top-16 bottom-[-96px] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-slate-50 dark:border-[#0a0a0a] shadow-lg flex items-center justify-center shrink-0 relative z-10">
              <Server className="w-6 h-6 text-indigo-500" />
            </div>
            <FadeIn direction="up" delay={0.3} className="flex-1 bg-white dark:bg-[#121212] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-display font-medium mb-4">2. Asynchronous Processing</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Audio AI requires immense computational power. Redis and Celery is used to process your files asynchronously. 
              </p>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">You can close your browser. We'll keep working in the background.</span>
              </div>
            </FadeIn>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-4 border-slate-50 dark:border-[#0a0a0a] shadow-lg flex items-center justify-center shrink-0 relative z-10">
              <Download className="w-6 h-6 text-emerald-500" />
            </div>
            <FadeIn direction="up" delay={0.4} className="flex-1 bg-white dark:bg-[#121212] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-display font-medium mb-4">3. Instant Export</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Once processing completes, preview your separated stems or enhanced speech instantly using our interactive web player. Download high-quality WAV files, MP3s, or subtitle formats directly to your device.
              </p>
            </FadeIn>
          </div>

        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
