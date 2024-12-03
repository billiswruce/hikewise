import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/Trails.module.scss";

const Trails = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActiveTab = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className={styles.trailsContainer}>
      <h2>{t("trails")}</h2>
      <nav className={styles.tabNavigation}>
        <Link
          to="hiking"
          className={`${styles.tab} ${
            isActiveTab("hiking") ? styles.active : ""
          }`}>
          {t("hikingTrails")}
        </Link>
        <Link
          to="hiked"
          className={`${styles.tab} ${
            isActiveTab("hiked") ? styles.active : ""
          }`}>
          {t("hikedTrails")}
        </Link>
        <Link
          to="favorite-trails"
          className={`${styles.tab} ${
            isActiveTab("favorite-trails") ? styles.active : ""
          }`}>
          {t("favoriteTrails")}
        </Link>
      </nav>
      <div className={styles.tabContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Trails;
