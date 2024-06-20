// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Elections from './components/Elections';
import Candidates from './components/Candidates';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/elections" element={authenticated ? <Elections /> : <Navigate to="/login" />} />
        <Route path="/candidates" element={authenticated ? <Candidates /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
