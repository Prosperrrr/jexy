## [1.1.0] - 2026-03-26
### Added
- Supabase database integration
- Jobs table to track processing history per user
- GET /api/jobs endpoint — returns all jobs for authenticated user
- Supabase credentials to backend .env

### Changed
- MAX_CONTENT_LENGTH reduced from 500MB to 50MB
- Welcome message updated from "Jexi" to "Jexy"

### Removed
- 24h file cleanup scheduler
- File cleanup routes (storage/stats, cleanup/now, cleanup/job)

## [1.0.0] - Initial Release
### Added
- Flask backend with YAMNet, Demucs, Whisper, DeepFilterNet
- Audio upload and classification pipeline
- Music processing (stem separation, BPM, key detection, lyrics)
- Speech processing (noise reduction, transcription)
- Rate limiting
- CORS support for React frontend
