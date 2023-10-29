import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import authService from '../utils/authService';

function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
