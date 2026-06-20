import FadeIn from './FadeIn';

export default function CallToAction() {
  return (
    <section className="py-32 relative text-center px-4 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800">
      <FadeIn delay={0.2} direction="up">
        <h2 className="text-4xl font-display font-medium mb-6 text-slate-900 dark:text-white">Ready to enhance your audio?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto">Experience the next generation of audio processing. Upload your first file and see the magic happen.</p>
        <a href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-lg font-medium hover:scale-105 transition-all shadow-lg">
          Start Creating Free
        </a>
      </FadeIn>
    </section>
  );
}
