import { useEffect, useState } from "react";
import { Trail } from "../models/Trail";
import styles from "../styles/Hiking.module.scss";
import favoritePlaceholder from "../assets/favoritesPlaceholder.webp";
import { useFavorites } from "../hooks/useFavorites";

const FavoriteTrails = () => {
  const [favoriteTrails, setFavoriteTrails] = useState<Trail[]>([]);
  const [sortOption, setSortOption] = useState<
    "name-asc" | "name-desc" | "date-asc" | "date-desc"
  >("name-asc");
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchFavoriteTrails = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/users/me/favorites",
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
      }
    };

    fetchFavoriteTrails();
  }, []);

  // Sorteringslogik
  const sortedTrails = [...favoriteTrails].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "date-asc") {
      return new Date(a.hikeDate).getTime() - new Date(b.hikeDate).getTime();
    } else if (sortOption === "date-desc") {
      return new Date(b.hikeDate).getTime() - new Date(a.hikeDate).getTime();
    }
    return 0;
  });

  return (
    <div className={styles.hikingContainer}>
      {/* Filtreringsalternativ */}
      <div className={styles.filterContainer}>
        <label>Sortera efter:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as typeof sortOption)}>
          <option value="name-asc">Namn (A-Ö)</option>
          <option value="name-desc">Namn (Ö-A)</option>
          <option value="date-asc">Datum (Äldsta först)</option>
          <option value="date-desc">Datum (Nyaste först)</option>
        </select>
      </div>

      <div className={styles.sections}>
        {sortedTrails.map((trail) => (
          <div key={trail._id} className={styles.section}>
            <img
              src={trail.image || favoritePlaceholder}
              alt={trail.name}
              className={styles.sectionImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = favoritePlaceholder;
              }}
            />
            <div className={styles.trailInfo}>
              <div className={styles.trailDetails}>
                <span>
                  <h3>{trail.name}</h3>
                </span>
                <span>{trail.length} km</span>
                <span>{trail.difficulty}</span>
                <span>{new Date(trail.hikeDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              className={`${styles.favoriteButton} ${
                favorites.has(trail._id) ? styles.active : ""
              }`}
              onClick={() => toggleFavorite(trail._id)}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteTrails;
