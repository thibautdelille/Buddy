import { createContext } from 'react';
import { Dog } from '../../api/types';

export interface FavoritesContextType {
  favorites: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const STORAGE_KEY = 'buddy_favorites';
