import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const yourAuthToken = localStorage.getItem("authToken");

        const response = await fetch(
          "http://localhost:3001/api/users/me/favorites",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${yourAuthToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavorites(new Set(data));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (trailId: string) => {
    console.log("Toggle favorite for trail ID:", trailId);
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(trailId)) {
        newFavorites.delete(trailId);
      } else {
        newFavorites.add(trailId);
      }
      return newFavorites;
    });

    try {
      await fetch(`http://localhost:3001/api/users/favorites/${trailId}`, {
        method: "POST",
        credentials: "include", // Viktigt för sessionhantering
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

export const useFavorites = () => useContext(FavoriteContext);
