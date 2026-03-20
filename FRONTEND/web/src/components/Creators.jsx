import FadeIn from './FadeIn';

export default function Creators() {
  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn direction="up" delay={0.1} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-900 dark:text-white">
            Built for every creator
          </h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Podcasters Card */}
          <FadeIn direction="up" delay={0.2} className="group bg-white dark:bg-[#121212] rounded-[2rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-orange-500">mic</span>
            </div>
            <h3 className="text-2xl font-display font-medium mb-4 text-slate-900 dark:text-white">
              Podcasters
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Turn raw interviews into polished episodes. Automatic leveling, noise reduction, and SRT generation for accessible captions.
            </p>
            <a href="#" className="inline-flex items-center text-teal-500 font-medium hover:gap-2 transition-all">
              Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </FadeIn>

          {/* Musicians Card */}
          <FadeIn direction="up" delay={0.3} className="group bg-white dark:bg-[#121212] rounded-[2rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-blue-500">piano</span>
            </div>
            <h3 className="text-2xl font-display font-medium mb-4 text-slate-900 dark:text-white">
              Musicians
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Extract stems from any song to create backing tracks. Perfect for practice, covers, or remix competitions.
            </p>
            <a href="#" className="inline-flex items-center text-teal-500 font-medium hover:gap-2 transition-all">
              Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </FadeIn>

          {/* Video Editors Card */}
          <FadeIn direction="up" delay={0.4} className="group bg-white dark:bg-[#121212] rounded-[2rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-pink-500">movie</span>
            </div>
            <h3 className="text-2xl font-display font-medium mb-4 text-slate-900 dark:text-white">
              Video Editors
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Fix bad on-location audio in post. Separate dialogue from background noise without complex EQ automation.
            </p>
            <a href="#" className="inline-flex items-center text-teal-500 font-medium hover:gap-2 transition-all">
              Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </FadeIn>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
}
