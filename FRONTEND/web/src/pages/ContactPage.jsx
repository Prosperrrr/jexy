import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FadeIn from '../components/FadeIn';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.documentElement.style.fontSize = '14px';
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-32 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-100/40 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full max-w-2xl h-96 bg-fuchsia-100/30 dark:bg-fuchsia-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <FadeIn delay={0.1} direction="up">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-tight">
                  Let's create something <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">incredible.</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-10 max-w-lg">
                  Have questions about our AI models, integration possibilities, or just want to say hi? Drop us a line and we'll get back to you as soon as possible.
                </p>

                <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Us Directly</p>
                    <a href="mailto:prospersobamiwa@jexy.me" className="text-blue-500 hover:text-blue-600 transition-colors text-sm font-light">prospersobamiwa@jexy.me</a>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Contact Form */}
            <FadeIn delay={0.2} direction="left" className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden">
                
                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3">Message Sent!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                      Thanks for reaching out. We've received your message and will get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === 'error' && (
                      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMessage || 'Failed to send message. Please ensure your VITE_WEB3FORMS_KEY is set.'}</span>
                      </div>
                    )}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Name</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 font-light"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 font-light"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 font-light"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Message</label>
                      <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 font-light resize-none"
                        placeholder="Tell us a little bit about your project..."
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] outline-none ${
                          status === 'loading' 
                            ? 'bg-blue-400 text-white cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 text-white'
                        }`}
                      >
                        {status === 'loading' ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
