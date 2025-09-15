import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <Login />;
};

export default Home;
