import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/ToastProvider';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { show } = useToast();

  useEffect(() => {
    if (user) {
      show(`Bonjour ${user.name} ! 👋`, { variant: 'success' });
    }
  }, [user, show]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;
