import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <button 
          className="btn btn-ghost text-xl"
          onClick={() => navigate('/')}
        >
          BugTracker
        </button>
      </div>

      {/* Boutons desktop (>= md) */}
      <div className="hidden md:flex gap-2">
        {!isAuthenticated ? (
          <>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/')}
            >
              Se connecter
            </button>
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/register')}
            >
              S'inscrire
            </button>
          </>
        ) : (
          <button 
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        )}
      </div>

      {/* Burger mobile (< md) */}
      <div className="md:hidden">
        <div className="dropdown dropdown-end">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Ouvrir le menu"
            tabIndex={0}
          >
            {/* icône burger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Contenu du menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {!isAuthenticated ? (
              <>
                <li>
                  <button onClick={() => navigate('/')}>Se connecter</button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')}>S'inscrire</button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={handleLogout}>Se déconnecter</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;