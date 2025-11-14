
import React from 'react';
import { PlusIcon, ArrowLeftOnRectangleIcon, UserGroupIcon } from './ui/icons';
import { User, Role } from '../types';


interface HeaderProps {
  user: User;
  onLogout: () => void;
  onAddAnime: () => void;
  onSearch: (term: string) => void;
  onOpenAdminPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAddAnime, onSearch, onOpenAdminPanel }) => {
  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-40 border-b border-primary/20 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Ani<span className="text-primary">Track</span>
            </h1>
            <div className="text-sm text-text-secondary hidden md:block">
              Welcome, <span className="font-bold text-primary">{user.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <input
              type="text"
              placeholder="Search anime..."
              onChange={(e) => onSearch(e.target.value)}
              className="hidden sm:block w-40 md:w-64 bg-background border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              onClick={onAddAnime}
              className="flex items-center gap-2 px-3 py-2 md:px-4 bg-primary text-white font-semibold rounded-lg hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/50"
              title="Add Anime"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden md:inline">Add Anime</span>
            </button>
             {user.role === Role.Admin && (
               <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  title="Admin Panel"
                >
                  <UserGroupIcon className="w-5 h-5" />
                  <span className="hidden md:inline">Admin</span>
                </button>
             )}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-white hover:bg-primary/20 rounded-lg transition-all"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
