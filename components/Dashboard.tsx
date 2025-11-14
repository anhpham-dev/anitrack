
import React, { useState, useMemo, useEffect } from 'react';
import { Anime } from '../types';
import { getUserAnime, saveUserAnime } from '../db';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import AnimeGrid from './AnimeGrid';
import AnimeModal from './AnimeModal';
import AnimeForm from './AnimeForm';
import AdminPanel from './AdminPanel';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data for the current user
  useEffect(() => {
    if (currentUser) {
      setAnimeList(getUserAnime(currentUser.username));
      setIsLoaded(true);
    }
  }, [currentUser]);

  // Save data for the current user whenever animeList changes
  useEffect(() => {
    if (isLoaded && currentUser) {
      saveUserAnime(currentUser.username, animeList);
    }
  }, [animeList, isLoaded, currentUser]);

  const filteredAnimeList = useMemo(() => {
    if (!searchTerm) {
      return animeList;
    }
    return animeList.filter(anime =>
      anime.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anime.alternativeTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [animeList, searchTerm]);

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };
  
  const handleOpenForm = (anime: Anime | null = null) => {
    setEditingAnime(anime);
    setIsFormOpen(true);
    setSelectedAnime(null); // Close details modal if open
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAnime(null);
  };
  
  const handleSaveAnime = (animeToSave: Anime) => {
    setAnimeList(prevList => {
      const exists = prevList.some(a => a.id === animeToSave.id);
      if (exists) {
        return prevList.map(a => (a.id === animeToSave.id ? animeToSave : a));
      }
      return [animeToSave, ...prevList];
    });
    handleCloseForm();
  };

  const handleDeleteAnime = (id: string) => {
    if (window.confirm('Are you sure you want to delete this anime from your list?')) {
      setAnimeList(prev => prev.filter(a => a.id !== id));
      handleCloseModal();
    }
  };
  
  const handleEditAnime = (anime: Anime) => {
    handleOpenForm(anime);
  };

  if (!currentUser) return null;

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans">
      <Header 
        user={currentUser}
        onLogout={logout}
        onAddAnime={() => handleOpenForm()} 
        onSearch={setSearchTerm} 
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimeGrid animeList={filteredAnimeList} onSelectAnime={handleSelectAnime} />
      </main>
      {selectedAnime && (
        <AnimeModal 
          anime={selectedAnime} 
          onClose={handleCloseModal} 
          onEdit={handleEditAnime}
          onDelete={handleDeleteAnime}
        />
      )}
      <AnimeForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveAnime}
        initialData={editingAnime}
      />
      {currentUser.role === 'admin' && (
        <AdminPanel 
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
