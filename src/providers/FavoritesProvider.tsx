import { useEffect, useState } from 'react';
import { Dog } from '../api/types';
import {
  FavoritesContext,
  STORAGE_KEY,
} from '../features/favorites/FavoritesContext';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (dog: Dog) => {
    setFavorites((prev) => [...prev, dog]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((dog) => dog.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
