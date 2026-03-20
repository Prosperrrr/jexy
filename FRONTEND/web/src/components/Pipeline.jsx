import FadeIn from './FadeIn';

export default function Pipeline() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn delay={0.1} direction="up" className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-display font-medium mb-4">The Pipeline</h2>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
              {'//'} Automated routing based on content type analysis
            </p>
          </div>
          <div className="hidden md:block">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl text-blue-500/50 dark:text-blue-400/30">
              schema
            </span>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FadeIn delay={0.2} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              01
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Input Analysis</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: YAMNet</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Audio tensors are analyzed for event classification (speech vs. music vs. noise) to determine the optimal processing route.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              02
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Stem Separation</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: Demucs v4</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              For musical content, the Hybrid Transformer architecture isolates vocals, drums, bass, and other instruments into discrete streams.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              03
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Signal Enhancement</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: DeepFilterNet</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Speech segments undergo complex spectral filtering to attenuate stationary and non-stationary noise while preserving formants.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.5} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              04
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Transcription</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: Whisper v3</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Final enhanced audio is passed through a transformer-based ASR model for high-accuracy multilingual transcription and timestamping.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
