import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/ToastProvider';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { show } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        show('Connexion réussie !', { variant: 'success' });
        navigate('/');
      } else {
        show('Email ou mot de passe incorrect', { variant: 'error' });
      }
    } catch (error) {
      show('Erreur de connexion', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
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
          <button 
            type="submit" 
            className="btn btn-outline" 
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;