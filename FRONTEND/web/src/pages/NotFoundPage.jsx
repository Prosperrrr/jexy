import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-sans text-slate-900 dark:text-white selection:bg-teal-500/30">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="max-w-md w-full bg-white dark:bg-[#121212] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
          
          <h1 className="text-8xl font-display font-bold tracking-tighter mb-4 text-slate-200 dark:text-slate-800">404</h1>
          <h2 className="text-2xl font-display font-medium mb-3">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 font-light mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:scale-[1.02] transition-transform shadow-md"
          >
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
