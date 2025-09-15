import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API later
    console.log({ name, email, password });
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un compte</h1>
        <form onSubmit={onSubmit} className="mx-auto max-w-sm p-6 rounded-lg flex flex-col gap-4">
          <Input
            legend="Nom"
            name="name"
            type="text"
            placeholder="ex: Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button type="submit" className="btn btn-outline">Créer le compte</button>
        </form>
      </main>
    </div>
  );
};

export default Register;
