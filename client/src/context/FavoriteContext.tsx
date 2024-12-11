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
      if (!isAuthenticated) {
        setFavorites(new Set());
        return;
      }

      try {
        // const token = await getAccessTokenSilently();
        console.log("Försöker hämta favoriter...");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me/favorites`,
          {
            method: "GET",
            credentials: "include", // Skicka session-cookie
          }
        );
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const favoriteTrails = await response.json();
        console.log("Hämtade favoriter:", favoriteTrails);

        // Kontrollera om favoriteTrails är en array innan vi använder map
        if (Array.isArray(favoriteTrails)) {
          setFavorites(new Set(favoriteTrails.map((trail) => trail._id)));
        } else {
          console.error("Oväntad datastruktur:", favoriteTrails);
        }
      } catch (err) {
        console.error("Fel vid hämtning av favoriter:", err);
      }
    };

    loadFavorites();
  }, [isAuthenticated, getAccessTokenSilently]);

  const toggleFavorite = async (trailId: string) => {
    if (!isAuthenticated) {
      console.log("Användaren måste vara inloggad för att hantera favoriter");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("Försöker toggla favorit för trail:", trailId);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/favorites/toggle/${trailId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Kunde inte uppdatera favoritstatus");
      }

      const result = await response.json();
      console.log("Toggle resultat:", result);

      // Uppdatera lokala favoriter baserat på serverns svar
      if (result.favorites) {
        setFavorites(new Set(result.favorites));
      }
    } catch (err) {
      console.error("Fel vid uppdatering av favorit:", err);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export { FavoriteContext };
