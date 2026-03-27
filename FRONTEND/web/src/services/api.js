import axios from 'axios';
import { auth } from '@/lib/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Add a request interceptor to attach the X-User-ID header and bypass ngrok
api.interceptors.request.use(
  (config) => {
    config.headers['ngrok-skip-browser-warning'] = 'true';
    const uid = auth.currentUser?.uid;
    if (uid) {
      config.headers['X-User-ID'] = uid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Upload an audio file for initial classification
 * POST /api/upload
 */
export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Confirm content type and start processing
 * POST /api/process/{file_id}
 */
export const confirmAndProcess = async (file_id, content_type) => {
  const response = await api.post(`/api/process/${file_id}`, { content_type });
  return response.data;
};

/**
 * Poll music processing status
 * GET /api/process/music/{job_id}/status
 */
export const getMusicStatus = async (job_id) => {
  const response = await api.get(`/api/process/music/${job_id}/status`);
  return response.data;
};

/**
 * Poll speech processing status
 * GET /api/process/speech/{job_id}/status
 */
export const getSpeechStatus = async (job_id) => {
  const response = await api.get(`/api/process/speech/${job_id}/status`);
  return response.data;
};

/**
 * Get results of completed music processing
 * GET /api/process/music/{job_id}
 */
export const getMusicResults = async (job_id) => {
  const response = await api.get(`/api/process/music/${job_id}`);
  return response.data;
};

/**
 * Get results of completed speech processing
 * GET /api/process/speech/{job_id}
 */
export const getSpeechResults = async (job_id) => {
  const response = await api.get(`/api/process/speech/${job_id}`);
  return response.data;
};

/**
 * Get history of user jobs
 * GET /api/jobs
 */
export const getUserJobs = async () => {
  const response = await api.get('/api/jobs');
  return response.data;
};

/**
 * Delete a user job
 * DELETE /api/jobs/{job_id}
 */
export const deleteJob = async (job_id) => {
  const response = await api.delete(`/api/jobs/${job_id}`);
  return response.data;
};

export default api;
