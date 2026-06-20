import FadeIn from './FadeIn';

export default function Pipeline() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn delay={0.1} direction="up" className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-display font-medium mb-4">Two Powerful Pipelines. Zero Friction.</h2>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
              {'//'} Automatically routes your audio to the right pipeline.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl text-blue-500/50 dark:text-blue-400/30">
              schema
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FadeIn delay={0.2} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              01
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Intelligent Auto-Routing</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: YAMNet</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              <span className="font-display font-bold tracking-tight">jexy</span> automatically detects if your file is music or speech and routes it to the right pipeline.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              02
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Studio-Grade Stem Separation</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: Demucs v4</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Instantly split any song into 6 stems: vocals, drums, bass, guitar, piano, and other. Mix, mute, and solo right in the browser.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              03
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Crystal Clear Speech</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: DeepFilterNet</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Remove background noise, wind, and room echo from podcasts, interviews, and voice notes.
            </p>
          </FadeIn>

          <FadeIn delay={0.5} direction="up" className="group relative bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-blue-500/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-800 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
              04
            </div>
            <h3 className="text-xl font-display font-medium mb-2">Synced Transcripts & Lyrics</h3>
            <div className="text-xs font-mono text-accent mb-4">Model: Whisper v3</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Generate timestamped lyrics and transcripts. Export instantly to TXT, JSON, or SRT subtitle files.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
