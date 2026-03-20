import FadeIn from './FadeIn';

export default function Contribute() {
  return (
    <section className="relative py-32 overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800">
      <FadeIn direction="up" delay={0.2} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6 md:mb-8">
          Contribute to the research
        </h2>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 md:mb-12 max-w-2xl mx-auto px-2">
          Jexy is an open-source initiative. We welcome contributions from researchers and developers to improve the models and the pipeline.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 px-4">
          <a href="#" className="bg-black dark:bg-white text-white dark:text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all hover:scale-105 flex items-center justify-center gap-2">
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
          <a href="#" className="bg-white dark:bg-transparent text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">library_books</span>
            Documentation
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
