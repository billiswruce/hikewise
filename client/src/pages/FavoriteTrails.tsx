import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trail } from "../models/Trail";
import styles from "../styles/Hiking.module.scss";
import favoritesPlaceholder from "../assets/favoritesPlaceholder.webp";
import { useFavorites } from "../hooks/useFavorites";
import Filter from "../components/Filter";
import { useTrailSort } from "../hooks/useTrailSort";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LoadingScreen from "../components/LoadingScreen";

const FavoriteTrails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favoriteTrails, setFavoriteTrails] = useState<Trail[]>([]);
  const [sortOption, setSortOption] = useState<
    "name-asc" | "name-desc" | "date-asc" | "date-desc"
  >("name-asc");
  const { favorites, toggleFavorite } = useFavorites();
  const sortedTrails = useTrailSort(favoriteTrails, sortOption);
  const [trailToRemove, setTrailToRemove] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleToggleFavorite = async (trailId: string) => {
    setTrailToRemove(trailId);
  };

  const handleTrailClick = (trailId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(`.${styles.favoriteButton}`)) {
      return;
    }
    navigate(`/trail/${trailId}`);
  };

  const fetchFavoriteTrails = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching favorite trails");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me/favorites`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFavoriteTrails(data);
    } catch (error) {
      console.error("Error fetching favorite trails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteTrails();
  }, []);

  console.log("Favorite trails:", JSON.stringify(favoriteTrails));

  const handleConfirmRemove = async () => {
    if (!trailToRemove) return;

    try {
      setFavoriteTrails((prevTrails) =>
        prevTrails.filter((trail) => trail._id !== trailToRemove)
      );
      await toggleFavorite(trailToRemove);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      fetchFavoriteTrails();
    } finally {
      setTrailToRemove(null);
    }
  };

  return (
    <div className={styles.hikingContainer}>
      <div className={styles.headerSection}>
        <Filter sortOption={sortOption} setSortOption={setSortOption} />
        <span className={styles.trailCount}>
          {sortedTrails.length}{" "}
          {t(sortedTrails.length === 1 ? "trail" : "trails")}
        </span>
      </div>

      <div className={styles.sections}>
        {sortedTrails.map((trail) => (
          <div
            key={trail._id}
            className={styles.section}
            onClick={(e) => handleTrailClick(trail._id, e)}>
            <img
              src={trail.image || favoritesPlaceholder}
              alt={trail.name}
              className={styles.sectionImage}
            />
            <div className={styles.trailInfo}>
              <div className={styles.trailDetails}>
                <h3>{trail.name}</h3>
                <span>{trail.length} km</span>
                <span>{new Date(trail.hikeDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              className={`${styles.favoriteButton} ${
                favorites.has(trail._id) ? styles.active : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(trail._id);
              }}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        sortedTrails.length === 0 && (
          <div className={styles.noTrails}>
            <p>{t("noFavoriteTrails")}</p>
          </div>
        )
      )}

      <ConfirmationDialog
        isOpen={!!trailToRemove}
        message={t("confirmRemoveFavorite")}
        onConfirm={handleConfirmRemove}
        onCancel={() => setTrailToRemove(null)}
      />
    </div>
  );
};

export default FavoriteTrails;
