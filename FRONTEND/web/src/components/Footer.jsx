import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black pt-16 pb-8 border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Link to="/" className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity">jexy</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-6 text-slate-900 dark:text-white">Made For</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-light">
              <li>Musicians</li>
              <li>Producers</li>
              <li>Video Editors</li>
              <li>Podcasters</li>
              <li>Students</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 text-slate-900 dark:text-white">Project</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-light">
              <li><Link to="/changelog" className="hover:text-black dark:hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-mono">© 2026 <span className="font-display font-bold tracking-tight">jexy</span> Project. Open Source.</p>
          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
