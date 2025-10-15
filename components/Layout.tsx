import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { SkatesIcon, CalendarIcon, BookOpenIcon } from './Icons';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-isabelline text-raisin-black font-sans">
      <div className="flex">
        <aside className="w-20 md:w-56 bg-raisin-black/90 backdrop-blur-sm p-4 border-r border-onyx/50 flex flex-col items-center md:items-start fixed h-full">
          <h1 className="text-xl md:text-2xl font-bold text-bone mb-10 flex items-center gap-2">
            <SkatesIcon className="h-8 w-8 text-bone" />
            <span className="hidden md:inline">Treinin</span>
          </h1>
          <nav className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                }`
              }
            >
              <SkatesIcon className="h-6 w-6" />
              <span className="hidden md:inline font-medium">Habilidades</span>
            </NavLink>
             <NavLink
              to="/skill-shop"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                }`
              }
            >
              <BookOpenIcon className="h-6 w-6" />
              <span className="hidden md:inline font-medium">Explorar</span>
            </NavLink>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                }`
              }
            >
              <CalendarIcon className="h-6 w-6" />
              <span className="hidden md:inline font-medium">Treinos</span>
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 ml-20 md:ml-56 p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;