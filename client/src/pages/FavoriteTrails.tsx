import { useEffect, useState } from "react";
import { Trail } from "../models/Trail";
import styles from "../styles/Hiking.module.scss";

interface FavoriteTrailsProps {
  trails?: Trail[];
}

const FavoriteTrails = ({ trails = [] }: FavoriteTrailsProps) => {
  const [favoriteTrails, setFavoriteTrails] = useState<Trail[]>([]);

  useEffect(() => {
    if (trails.length === 0) {
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
    } else {
      setFavoriteTrails(trails);
    }
  }, [trails]);

  return (
    <div className={styles.hikingContainer}>
      <h3>Favoritvandringar</h3>
      {favoriteTrails.map((trail) => (
        <div key={trail._id} className={styles.section}>
          <h3>{trail.name}</h3>
          <span>{trail.length} km</span>
          <p>{trail.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FavoriteTrails;
