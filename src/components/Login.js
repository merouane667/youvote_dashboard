// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestLogin, validateLogin } from '../services/authService';
import { TextField, Button, Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';

const Login = ({ setAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestLogin(email);
      setStep(2);
      setNotification({ open: true, message: 'Login ID and Password sent to your email.', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to request login.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await validateLogin(email, loginId, loginPassword);

      if (user.role === 'admin') {
        setAuthenticated(true);
        setNotification({ open: true, message: 'Login successful.', severity: 'success' });
        navigate('/dashboard');
      } else {
        throw new Error('Access denied. Only admins can log in.');
      }
    } catch (error) {
      setNotification({ open: true, message: error.message || 'Login failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ boxShadow: 3, p: 4, borderRadius: 2, backgroundColor: 'white' }}>
        <Typography variant="h4" gutterBottom>
          {step === 1 ? "Request Login" : "Enter Login Details"}
        </Typography>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Request Login'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Login ID"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        )}
      </Box>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
