import { useOutletContext } from "react-router-dom";
import styles from "../styles/Hiking.module.scss";
import trailPlaceholder from "../assets/trailPlaceholdersquare.webp";
import { Trail } from "../models/Trail";
import { useFavorites } from "../hooks/useFavorites";
import Filter from "../components/Filter";
import { useTrailSort } from "../hooks/useTrailSort";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Hiking = () => {
  const { t } = useTranslation();
  const { upcomingTrails }: { upcomingTrails: Trail[] } = useOutletContext();
  const { favorites, toggleFavorite } = useFavorites();
  const [sortOption, setSortOption] = useState<
    "name-asc" | "name-desc" | "date-asc" | "date-desc"
  >("name-asc");
  const sortedTrails = useTrailSort(upcomingTrails, sortOption);
  const navigate = useNavigate();

  console.log("Trail object:", upcomingTrails);

  const handleTrailClick = (trailId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(`.${styles.favoriteButton}`)) {
      return;
    }
    navigate(`/trail/${trailId}`);
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
              src={trail.image || trailPlaceholder}
              alt={trail.name}
              className={styles.sectionImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = trailPlaceholder;
              }}
            />
            <div className={styles.trailInfo}>
              <div className={styles.trailDetails}>
                <h3>{trail.name}</h3>
                <span>{trail.length} km</span>
                {/* <span>{t(trail.difficulty)}</span> */}
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

export default Hiking;
