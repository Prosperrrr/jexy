export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black pt-16 pb-8 border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">jexy</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6 font-light">
              Advancing the field of audio AI through open-source collaboration and transparent research.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-6 text-slate-900 dark:text-white">Made For</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-light">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Musicians</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Producers</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Video Editors</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Podcasters</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Students</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 text-slate-900 dark:text-white">Project</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-light">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Manifesto</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 text-slate-900 dark:text-white">Community</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-light">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">GitHub Discussions</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contributing Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-mono">© 2026 Jexy Project. Open Source.</p>
          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
