// src/services/api.js
import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Election Endpoints
export const getElections = () => api.get('/elections');
export const createElection = (election) => api.post('/elections', election);
export const updateElection = (id, election) => api.put(`/elections/${id}`, election);
export const deleteElection = (id) => api.delete(`/elections/${id}`);

// Candidate Endpoints
export const addCandidateToElection = (electionId, candidate) => api.post(`/candidates/${electionId}`, candidate);
export const getCandidateById = (id) => api.get(`/candidate/${id}`);
export const getCandidatesByElection = (electionId) => api.get(`/candidates/${electionId}`);
export const updateCandidateInElection = (electionId, candidateId, candidate) => api.put(`/candidates/${electionId}/${candidateId}`, candidate);
export const deleteCandidateFromElection = (electionId, candidateId) => api.delete(`/candidates/${electionId}/${candidateId}`);
