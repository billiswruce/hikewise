import React, { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const FavoriteContext = createContext<{
  favorites: Set<string>;
  toggleFavorite: (trailId: string) => Promise<void>;
}>({
  favorites: new Set(),
  toggleFavorite: async () => Promise.resolve(),
});

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me/favorites`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavorites(new Set(data.map((trail: { _id: string }) => trail._id)));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };

    loadFavorites();
  }, [isAuthenticated, getAccessTokenSilently]);

  const toggleFavorite = async (trailId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/favorites/toggle/${trailId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status in the database");
      }

      // Uppdatera lokal state
      setFavorites((prevFavorites) => {
        const newFavorites = new Set(prevFavorites);
        const isCurrentlyFavorite = newFavorites.has(trailId);
        if (isCurrentlyFavorite) {
          newFavorites.delete(trailId);
        } else {
          newFavorites.add(trailId);
        }
        return newFavorites;
      });
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export { FavoriteContext };
