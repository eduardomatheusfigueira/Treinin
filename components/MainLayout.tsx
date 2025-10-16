import React, { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SkatesIcon, CalendarIcon, BookOpenIcon, LogOutIcon, UserIcon, MenuIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-isabelline text-raisin-black font-sans">
      <div className="flex">
        <aside className={`bg-raisin-black/90 backdrop-blur-sm p-4 border-r border-onyx/50 flex flex-col items-center fixed h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-56'}`}>
          <div className="flex items-center justify-between w-full mb-10">
            <h1 className={`text-xl font-bold text-bone flex items-center gap-2 ${isCollapsed ? 'hidden' : ''}`}>
              <SkatesIcon className="h-8 w-8 text-bone" />
              <span>Treinin</span>
            </h1>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-bone/70 hover:text-bone">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
          {user && (
            <nav className="flex flex-col gap-4 flex-grow w-full">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <UserIcon className="h-6 w-6" />
                <span className={`${isCollapsed ? 'hidden' : 'inline'} font-medium`}>Perfil</span>
              </NavLink>
              <NavLink
                to="/skill-shop"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <BookOpenIcon className="h-6 w-6" />
                <span className={`${isCollapsed ? 'hidden' : 'inline'} font-medium`}>Explorar</span>
              </NavLink>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <SkatesIcon className="h-6 w-6" />
                <span className={`${isCollapsed ? 'hidden' : 'inline'} font-medium`}>Habilidades</span>
              </NavLink>
              <NavLink
                to="/training"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-onyx text-bone' : 'text-bone/70 hover:bg-onyx/80 hover:text-bone'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <CalendarIcon className="h-6 w-6" />
                <span className={`${isCollapsed ? 'hidden' : 'inline'} font-medium`}>Treinos</span>
              </NavLink>
            </nav>
          )}
          {user && (
            <button
              onClick={signOut}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-bone/70 hover:bg-onyx/80 hover:text-bone w-full mt-auto ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOutIcon className="h-6 w-6" />
              <span className={`${isCollapsed ? 'hidden' : 'inline'} font-medium`}>Sair</span>
            </button>
          )}
        </aside>
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-56'}`}>
            {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;