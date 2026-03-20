import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 pt-2 md:pt-4 px-2 sm:px-4 lg:px-8 transition-colors duration-300 backdrop-blur-md bg-white/20 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <div className="flex justify-between items-center h-14 md:h-16 bg-white dark:bg-zinc-900 px-4 md:px-8 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm w-full">
            {/* Far Left: Logo */}
            <div className="flex-1 flex justify-start">
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                jexy
              </span>
            </div>
            {/* Center: Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                Models
              </a>
              <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                Workflow
              </a>
              <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                Documentation
              </a>
            </div>
            {/* Far Right: Actions */}
            <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
              <a href="#" aria-label="GitHub" className="hidden sm:flex text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors items-center">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <Link to="/login" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all shadow-sm whitespace-nowrap">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
