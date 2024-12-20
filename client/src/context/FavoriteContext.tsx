import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from "../components/LoadingScreen"; // Anpassa sökvägen för din loading-skärm

const FavoriteContext = createContext<{
  favorites: Set<string>;
  toggleFavorite: (trailId: string) => Promise<void>;
  isLoading: boolean;
}>({
  favorites: new Set(),
  toggleFavorite: async () => Promise.resolve(),
  isLoading: false,
});

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuth0();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/favorites`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favoriteTrails = await response.json();
      if (Array.isArray(favoriteTrails)) {
        setFavorites(new Set(favoriteTrails.map((trail) => trail._id)));
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (trailId: string) => {
    if (!isAuthenticated) {
      console.log("User must be logged in to manage favorites");
      return;
    }

    const newFavorites = new Set(favorites);
    if (newFavorites.has(trailId)) {
      newFavorites.delete(trailId);
    } else {
      newFavorites.add(trailId);
    }
    setFavorites(newFavorites);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/favorites/toggle/${trailId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const data = await response.json();
      setFavorites(new Set(data.favorites));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      await loadFavorites();
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isLoading }}>
      {isLoading && <LoadingScreen />}
      {children}
    </FavoriteContext.Provider>
  );
};

export { FavoriteContext };
