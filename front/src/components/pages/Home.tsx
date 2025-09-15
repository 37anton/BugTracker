import React from 'react';
import Navbar from '../../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center">BugTracker</h1>
        <h2 className="mt-3 text-lg md:text-xl text-base-content/70 text-center">La plateforme de gestion de tickets</h2>
      </main>
    </div>
  );
};

export default Home;