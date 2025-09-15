import React from 'react';
import Navbar from '../../components/Navbar';

export const Dashboard: React.FC = () => {
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
