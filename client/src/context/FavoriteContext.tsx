import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from "../components/LoadingScreen";

const FavoriteContext = createContext<{
  favorites: Set<string>;
  toggleFavorite: (trailId: string) => Promise<void>;
  isLoading: boolean;
}>({
  favorites: new Set(),
  toggleFavorite: async () => Promise.resolve(),
  isLoading: false,
});

interface FavoriteProviderProps {
  children: React.ReactNode;
  isReady: boolean;
}

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({
  children,
  isReady,
}) => {
  const { isAuthenticated } = useAuth0();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  const loadFavorites = useCallback(async () => {
    if (!isReady || !isAuthenticated || loadingRef.current) {
      console.log("Skipping favorites load:", {
        isReady,
        isAuthenticated,
        isLoading: loadingRef.current,
      });
      return;
    }

    loadingRef.current = true;
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
      console.log("Favorites loaded successfully:", favoriteTrails);
      if (Array.isArray(favoriteTrails)) {
        setFavorites(new Set(favoriteTrails.map((trail) => trail._id)));
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [isReady, isAuthenticated]);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [isReady, isAuthenticated, loadFavorites]);

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
