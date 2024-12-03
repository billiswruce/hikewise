import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Trails.module.scss";

interface Trail {
  id: string;
  name: string;
  length: number;
  difficulty: string;
  description: string;
  location: string;
  hikeDate: string;
  hikeEndDate: string;
  image?: string;
  creatorId: string;
}

const Trails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth0();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      if (!user?.sub) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/trails/user/${user.sub}`
        );
        const data = await response.json();
        setTrails(data);
      } catch (error) {
        console.error("Error fetching trails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrails();
  }, [user]);

  if (loading) return <div>{t("loading")}</div>;

  const upcomingTrails = trails.filter(
    (trail) => new Date(trail.hikeDate) >= new Date()
  );
  const hikedTrails = trails.filter(
    (trail) => new Date(trail.hikeDate) < new Date()
  );

  const isActiveTab = (path: string) => location.pathname.includes(path);

  return (
    <div className={styles.trailsContainer}>
      {location.pathname === "/trails" && (
        <Navigate to="/trails/hiking" replace />
      )}
      <h2 className={styles.heading}>{t("trails")}</h2>
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
        <Outlet
          context={{
            upcomingTrails,
            hikedTrails,
          }}
        />
      </div>
    </div>
  );
};

export default Trails;
