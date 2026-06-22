# jexy, an AI audio platform

> Separate stems. Enhance speech. Transcribe audio. All in your browser.

[![Live](https://img.shields.io/badge/Live-jexy.me-black?style=flat-square)](https://www.jexy.me)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

---

## What is jexy?

**jexy** is a full-stack AI audio processing platform. Upload any audio file and jexy automatically detects whether it's music or speech, then runs the optimal AI pipeline — separating stems for producers, reducing noise for podcasters, or generating transcripts for content creators.

No plugins. No installs. Just a browser.

---

## Features

### 🎵 Track Separation
- Separate any song into **6 isolated stems**: Vocals, Drums, Bass, Guitar, Piano, Other
- Real-time **per-stem waveform visualisation** with independent volume and mute controls
- **Scrolling lyrics view** with Whisper-powered timestamps synced to audio playback
- Download individual stems or all at once as WAV files

### 🎙️ Audio Enhancement
- **DeepFilterNet noise reduction** — surgically removes background noise
- Transcript generation with **TXT, JSON, and SRT subtitle** export formats
- Keeps the original filename through the full download pipeline

### 🤖 Intelligent Classification
- Automatic content detection via **YAMNet** (Google's audio classifier)
- Distinguishes music, speech, podcasts, sermons, and ambient sound

### 📊 Dashboard & History
- Session history with job status, original filename, and one-click re-open
- Background processing with live progress (0–100%) via polling
- Automatic file cleanup after 24 hours

### 🔐 Auth & Identity
- **Clerk** authentication — sign in with Google or email
- Protected routes; dashboard redirects unauthenticated users to login
- Custom user button with dark mode support

### 📱 Mobile App *(in progress)*
- React Native app for iOS and Android
- Mobile audio recording and upload
- Full feature parity with the web app

---

## Tech Stack

### Frontend — `FRONTEND/web`
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Clerk** | Authentication & user management |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **ffmpeg.wasm** | In-browser audio stem mixing |
| **PostHog** | Product analytics |
| **TailwindCSS** | Styling |
| **Web Audio API** | Waveform rendering & playback |

### Backend — `BACKEND`
| Technology | Purpose |
|---|---|
| **Python 3.11+** | Core backend language |
| **Flask** | REST API framework |
| **Celery** | Async task queue for long jobs |
| **YAMNet** | Audio classification (Google) |
| **Demucs** | 6-stem music separation (Meta) |
| **Whisper** | Speech-to-text transcription (OpenAI) |
| **DeepFilterNet** | Noise reduction (Xiph.org) |
| **Deepgram API** | Real-time transcription |
| **Librosa** | Audio analysis (BPM, key, duration) |
| **Supabase** | Session/job metadata storage |

---

## Project Structure

```
JEXY/
├── BACKEND/                    # Python Flask API
│   ├── app.py                  # Main Flask application & REST endpoints
│   ├── celery_app.py           # Celery async task definitions
│   ├── requirements.txt        # Python dependencies
│   ├── setup.sh                # Server bootstrap script
│   ├── models/
│   │   ├── yamnet_classifier.py     # Audio content detection
│   │   ├── music_processor.py       # Stem separation pipeline (Demucs + Whisper)
│   │   ├── speech_processor.py      # Noise reduction pipeline (DeepFilterNet + Whisper)
│   │   ├── realtime_processor.py    # WebSocket real-time processing
│   │   ├── deepgram_transcriber.py  # Live transcription via Deepgram
│   │   └── classifier.py            # Fallback classifier
│   ├── utils/
│   │   ├── file_cleanup.py          # Auto-delete processed files after 24h
│   │   └── rate_limiter.py          # Request rate limiting (5 uploads/min)
│   ├── uploads/                # Temporary raw uploads
│   └── processed/              # Processed output files
│
├── FRONTEND/
│   └── web/                    # React web application
│       ├── index.html
│       ├── vite.config.js
│       └── src/
│           ├── App.jsx                 # Router & auth guards
│           ├── main.jsx                # App entry point
│           ├── pages/
│           │   ├── LandingPage.jsx         # Marketing home page
│           │   ├── AuthPage.jsx            # Sign in / Sign up
│           │   ├── DashboardPage.jsx       # Job history & upload
│           │   ├── TrackSeparationPage.jsx # Music stem studio
│           │   ├── AudioEnhancerPage.jsx   # Speech enhancement studio
│           │   ├── HowItWorksPage.jsx      # Feature explainer
│           │   ├── ModelsPage.jsx          # AI models reference
│           │   ├── WorkflowPage.jsx        # Processing pipeline explainer
│           │   ├── ChangelogPage.jsx       # Version history
│           │   ├── ContactPage.jsx         # Contact form (EmailJS)
│           │   ├── PrivacyPolicyPage.jsx   # Privacy policy
│           │   ├── CookiePolicyPage.jsx    # Cookie policy
│           │   └── NotFoundPage.jsx        # 404 page
│           ├── components/
│           │   ├── Navbar.jsx
│           │   ├── Footer.jsx
│           │   ├── Hero.jsx
│           │   ├── FeatureSections.jsx
│           │   ├── Pipeline.jsx
│           │   ├── Sidebar.jsx
│           │   ├── Creators.jsx
│           │   ├── audio-enhancer/         # Enhancement-specific components
│           │   ├── track-separation/       # Stem studio components (waveforms, lyrics, mixer)
│           │   └── dashboard/              # Dashboard-specific components
│           ├── services/                   # API service layer (axios calls)
│           ├── utils/                      # Helper functions
│           └── workers/                    # Web Workers (audio processing)
│
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

---

### Backend Setup

```bash
# 1. Navigate to backend
cd BACKEND

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy the environment file and fill in your keys
cp .env.example .env
# Required: DEEPGRAM_API_KEY, SUPABASE_URL, SUPABASE_KEY

# 5. Run the Flask development server
python app.py
# API available at http://localhost:5000

# 6. (Optional) Run Celery worker for async jobs
celery -A celery_app worker --loglevel=info
```

> ⚠️ **First run:** Demucs, Whisper, and YAMNet models are downloaded automatically (~4–8 GB). This takes a few minutes and requires a stable internet connection.

---

### Frontend Setup

```bash
# 1. Navigate to the web app
cd FRONTEND/web

# 2. Install dependencies
npm install

# 3. Copy the environment file and fill in your keys
cp .env.example .env
# Required: VITE_CLERK_PUBLISHABLE_KEY, VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 4. Start the dev server
npm run dev
# App available at http://localhost:5173
```

---

## Environment Variables

### Backend `.env`
```env
DEEPGRAM_API_KEY=your_deepgram_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Frontend `.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://eu.i.posthog.com
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...
```

---

## API Overview

**Base URL:** `https://api.jexy.me` (production) / `http://localhost:5000` (local)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload and classify audio |
| `POST` | `/api/process/:file_id` | Start AI processing |
| `GET` | `/api/process/music/:job_id/status` | Poll music job progress |
| `GET` | `/api/process/music/:job_id` | Get music results & stem URLs |
| `GET` | `/api/process/speech/:job_id/status` | Poll speech job progress |
| `GET` | `/api/process/speech/:job_id` | Get speech results & transcript |
| `GET` | `/api/download/:job_id/:filename` | Download a processed file |
| `GET` | `/api/download/transcript/:job_id/:format` | Download transcript (`txt`/`json`/`srt`) |

---

## Deployment

### Frontend — Vercel (recommended)
```bash
npm run build
# Deploy the `dist/` folder to Vercel, Netlify, or Cloudflare Pages
```

### Backend — Linux Server (e.g. DigitalOcean, AWS EC2)
```bash
# The setup.sh script configures Gunicorn + Celery as systemd services
chmod +x setup.sh
./setup.sh

# Start services
sudo systemctl start jexy-api
sudo systemctl start jexy-celery
```

Use **Nginx** as a reverse proxy with an SSL certificate from Let's Encrypt.

---

## Roadmap

### ✅ Shipped
- AI stem separation with 6-track studio mixer
- Speech enhancement with noise reduction
- Whisper transcription (TXT / JSON / SRT)
- Scrolling lyrics view with timestamp sync
- Session history & job tracking
- Clerk authentication (Google, GitHub, email)
- Dark mode
- Contact form, Privacy Policy, Cookie Policy
- Changelog

### 🔄 In Progress
- React Native mobile app (iOS & Android)
- Mobile audio recording & upload

### 🗓️ Planned
- Batch file processing
- Collaborative session sharing
- Advanced waveform editor
- Real-time microphone noise reduction in the browser
- Custom model fine-tuning for domain-specific transcription

---

## Acknowledgements

| Model / Service | Credit |
|---|---|
| **Demucs** | Meta AI Research |
| **Whisper** | OpenAI |
| **YAMNet** | Google Research |
| **DeepFilterNet** | Xiph.org Foundation |
| **Deepgram** | Deepgram Inc. |
| **Clerk** | Clerk Inc. |
| **Supabase** | Supabase Inc. |

---

## Contact

**Prosper Sobamiwa**
- 🌐 [jexy.me](https://www.jexy.me)
- 📧 [prospersobamiwa@jexy.me](mailto:prospersobamiwa@jexy.me)
- 🐙 [@prosperrrr](https://github.com/prosperrrr)

---

<div align="center">
  Built with ❤️ for audio people everywhere.
  <br><br>
  <a href="#jexy--ai-powered-audio-studio">↑ Back to top</a>
</div>
