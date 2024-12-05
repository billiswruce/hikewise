import { useContext } from 'react';
import { FavoriteContext } from '../context/FavoriteContext';

export const useFavorites = () => useContext(FavoriteContext); 