import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const requestLogin = async (email) => {
  const response = await axios.post(`${API_URL}/login`, { email });
  return response.data;
};

export const validateLogin = async (email, loginId, loginPassword) => {
  const response = await axios.post(`${API_URL}/validate-login`, { email, loginId, loginPassword });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getToken = () => localStorage.getItem('token');

export const logout = () => {
  localStorage.removeItem('token');
};
