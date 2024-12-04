import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/Hiking.module.scss";
import hikedPlaceholder from "../assets/hikedPlaceholder.webp";
import { Trail } from "../models/Trail";

const Hiked = () => {
  const { t } = useTranslation();
  const { hikedTrails }: { hikedTrails: Trail[] } = useOutletContext();

  return (
    <div className={styles.hikingContainer}>
      <div className={styles.sections}>
        {hikedTrails.map((trail) => (
          <div key={trail.id} className={styles.section}>
            <img
              src={trail.image || hikedPlaceholder}
              alt={trail.name}
              className={styles.sectionImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = hikedPlaceholder;
              }}
            />
            <div className={styles.trailInfo}>
              <div className={styles.trailDetails}>
                <h3>{trail.name}</h3>
                <span>{trail.length} km</span>
                <span>{t(trail.difficulty)}</span>
                <span>{new Date(trail.hikeDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hiked;
