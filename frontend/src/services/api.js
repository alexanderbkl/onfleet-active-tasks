import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const onfleetApi = {
  getTeams: async (apiKey) => {
    const response = await api.post('/teams', { apiKey });
    return response.data;
  },

  getWorkers: async (apiKey) => {
    const response = await api.post('/workers', { apiKey });
    return response.data;
  },

  getTasks: async (apiKey, from, to) => {
    const response = await api.post('/tasks', { apiKey, from, to });
    return response.data;
  },

  getWorkerById: async (apiKey, id) => {
    const response = await api.post(`/workers/${id}`, { apiKey });
    return response.data;
  },

  getTaskById: async (apiKey, id) => {
    const response = await api.post(`/tasks/${id}`, { apiKey });
    return response.data;
  },
};
