import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API later
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
        <form onSubmit={onSubmit} className="mx-auto max-w-sm p-6 rounded-lg flex flex-col gap-4">
          <Input
            legend="Email"
            name="email"
            type="email"
            placeholder="ex: user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            legend="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">Se connecter</button>
        </form>
      </main>
    </div>
  );
};

export default Login;