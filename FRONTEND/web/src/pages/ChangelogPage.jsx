import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ChangelogPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">jexy Changelog</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-light">All notable changes to <span className="font-display font-bold tracking-tight">jexy</span> are documented here, from the very first commit on October 6, 2025.</p>
          </header>

          <div className="space-y-16">
            {/* 0.1.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold">0.1.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— October 2025</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">The Beginning — October 6, 2025</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Initial commit of JEXI (later renamed JEXY)</li>
                    <li>Flask backend</li>
                    <li>Audio classification algorithm — routing audio into music or speech pipeline</li>
                    <li>Demucs music processor</li>
                    <li>YAMNet model integration for audio classification</li>
                    <li>DeepFilterNet (initial) + Deepgram transcription (later replaced by Whisper)</li>
                    <li>Automatic file cleanup and upload limiting</li>
                    <li>Mono audio bug fix</li>
                    <li>Silence detection for music processor</li>
                    <li>README.md</li>
                    <li>.gitignore with uploads and env file excluded</li>
                    <li>Requirements.txt</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.0.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold">1.0.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— November 2025</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">The First Full Pipeline</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>YAMNet environmental sound classifier — custom 521-class grouping algorithm for music/speech routing</li>
                    <li>Demucs htdemucs_6s — 6 stem separation (vocals, drums, bass, guitar, piano, other)</li>
                    <li>DeepFilterNet3 — full-band broadband noise suppression (replaced noisereduce library)</li>
                    <li>Whisper base — automated speech transcription with timestamps</li>
                    <li>Full pipeline: upload → classify → confirm → separate/enhance → transcribe → results</li>
                    <li>Speech processor with noise reduction + transcription</li>
                    <li>Music processor with stem separation + lyrics transcription</li>
                    <li>Silence detection for empty stems</li>
                    <li>Timestamp support for frontend sync</li>
                    <li>Rate limiting</li>
                    <li>CORS support</li>
                    <li>Overall project restructure into BACKEND / FRONTEND folders</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">Changed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Switched from noisereduce to DeepFilterNet for superior noise suppression</li>
                    <li>TensorFlow forced to CPU to avoid CUDA conflict with PyTorch</li>
                    <li>Requirements updated and stabilised</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.1.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold">1.1.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— March 2026</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">The Frontend + Supabase Integration</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Full React + Vite + Tailwind CSS frontend</li>
                    <li>Landing page with animated typewriter hero headline</li>
                    <li>Login/Signup page with Firebase Google OAuth and email/password</li>
                    <li>Dashboard with 8-state processing machine</li>
                    <li>Track Separation page — DAW-style interface with waveform visualisation, M/S controls, timeline ruler</li>
                    <li>Audio Enhancer page — audio player, transcript sync, TXT/JSON/SRT export</li>
                    <li>Supabase PostgreSQL database integration</li>
                    <li>Jobs table to track processing history per user</li>
                    <li>GET /api/jobs endpoint — returns all jobs for authenticated user</li>
                    <li>MIT License</li>
                    <li>Mobile responsiveness across all pages</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">Changed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Project renamed from JEXI to JEXY</li>
                    <li>Backend version bumped to 1.1.0</li>
                    <li>MAX_CONTENT_LENGTH reduced from 500MB to 50MB</li>
                    <li>Supabase UUID bug fixed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">Removed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>24h file cleanup scheduler</li>
                    <li>File cleanup routes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.1.1 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold">1.1.1</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— April 2026</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">The Production Deployment</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Gunicorn production server replacing Werkzeug dev server</li>
                    <li>Caddy reverse proxy with automatic HTTPS via Let's Encrypt</li>
                    <li>Mix endpoint — POST /api/mix/&#123;job_id&#125; combines selected stems into downloadable MP3</li>
                    <li>Frontend download mix feature</li>
                    <li>Forced browser download instead of streaming for stem files</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">Changed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Backend deployed to Azure VM (Standard D2s v3, Ubuntu 24.04)</li>
                    <li>VITE_API_BASE_URL updated to HTTPS after Caddy setup</li>
                    <li>Demucs output changed from WAV to MP3 for efficient browser playback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Fixed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Track Separation page session loading loop bug</li>
                    <li>Audio Enhancer playback bug</li>
                    <li>Hardcoded WAV reference breaking after MP3 migration</li>
                    <li>Track Separation audio playback errors</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.2.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold">1.2.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— May 2026</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">The Cloud Storage Migration</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Processed files (stems, enhanced audio) now uploaded to Supabase Storage bucket</li>
                    <li>Frontend fetches stems directly from Supabase public URLs — no server file delivery</li>
                    <li>Stems load in parallel from Supabase CDN</li>
                    <li>Web Audio API engine — replaces HTML audio elements for perfect stem synchronisation</li>
                    <li>GainNodes for real-time volume, mute and solo control per stem</li>
                    <li>Server-side mixing with per-stem volume weights via ffmpeg</li>
                    <li>Mix result uploaded to Supabase, returned as URL, deleted after 5 minutes</li>
                    <li>Skeleton loader on Track Separation page while stems fetch</li>
                    <li>Repeat button on Track Separation page</li>
                    <li>Results endpoints now read from Supabase jobs table instead of local metadata files</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">Changed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Supabase upload now happens AFTER transcription completes — prevents Whisper from losing the file</li>
                    <li>Stems load directly from Supabase URLs (no blob fetching needed)</li>
                    <li>CPU/GPU device selection made dynamic — no hardcoded CUDA</li>
                    <li>Whisper model tested at large-v3, reverted to base for CPU deployment stability</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Fixed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Playback issues on Track Separation page</li>
                    <li>Supabase storage migration bugs</li>
                    <li>Multi-worker 404 bug (partial fix — full fix in v1.4.0 with Redis)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.3.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              <div className="absolute -left-[25px] top-4 bottom-[-64px] w-0.5 bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-6">
                <h2 className="text-2xl font-display font-bold">1.3.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— May 2026</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>vercel.json SPA routing fix — no more 404 on page refresh</li>
                    <li>How It Works page</li>
                    <li><span className="font-display font-bold tracking-tight">jexy</span> logo now clickable and routes to home page</li>
                    <li>Audio Enhancer page fully revamped — Spotify podcast style dark UI, auto-scrolling karaoke transcript, +15/-15 second skip buttons</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">Changed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Landing page overhauled — more modern, professional design</li>
                    <li>Landing page now fully mobile responsive</li>
                    <li>Lyrics section overflow fixed</li>
                    <li>Forced dark mode on Brave browser fixed</li>
                    <li>Black background on mobile screens fixed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Fixed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Audio Enhancer playback bug</li>
                    <li>Download mix logic moved entirely to server side — no more client-side encoding</li>
                    <li>Mix filenames now include stem names (e.g. jexy_vocals_drums_mix_songname.mp3)</li>
                    <li>Single stem download now fetches as blob — no more opening in new tab</li>
                    <li>Mix endpoint now fetches stems from Supabase instead of local disk</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 1.4.0 */}
            <section className="relative">
              <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-[#0a0a0a] z-10 hidden sm:block"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-6">
                <h2 className="text-2xl font-display font-bold">1.4.0</h2>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">— June 2026</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-3">Added</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Celery + Redis for async job processing — heavy ML tasks no longer block the server</li>
                    <li>Redis replaces in-memory <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-pink-500">uploaded_files</code> dictionary — fixes 404 errors with multiple workers</li>
                    <li>Job cancellation now properly terminates backend processing via Celery task revocation</li>
                    <li>Cancel feature for both upload and processing states with improved animation and UI flow</li>
                    <li>Total processed files count and search feature in session history</li>
                    <li>Loading screen for new users — fixes white screen on first login</li>
                    <li>Clerk Pro plan replaces Firebase Auth — OTP login, device login alerts, account management, password reset</li>
                    <li>PostHog analytics — tracks page views, file uploads, processing events, mix exports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Fixed</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-light list-disc pl-5">
                    <li>Google Auth bug for new users</li>
                    <li>Session history display for users migrated from Firebase to Clerk</li>
                    <li>Text overflow on larger screens</li>
                    <li>Missing posthog-js dependency</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-mono text-sm leading-relaxed">
              Built by Prosper Sobamiwa — October 2025 to June 2026 <br/>
              From a Flask script to a production SaaS platform. 🎓
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChangelogPage;
