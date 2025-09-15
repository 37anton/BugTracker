import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">BugTracker</a>
      </div>

      {/* Boutons desktop (>= md) */}
      <div className="hidden md:flex gap-2">
        <a className="btn btn-ghost">Se connecter</a>
        <a className="btn btn-ghost">Se déconnecter</a>
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
            <li><a /* href="#" */>Se connecter</a></li>
            <li><a /* href="#" */>Se déconnecter</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;