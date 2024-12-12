import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Trails.module.scss";
import { Trail } from "../models/Trail";
import LoadingScreen from "../components/LoadingScreen";

const Trails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth0();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const initialTab = location.state?.activeTab || "default-tab";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const fetchTrails = async () => {
      if (!user?.sub) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/trails/user/${user.sub}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

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

  useEffect(() => {
    const stateTab = location.state?.activeTab;
    if (stateTab) {
      setActiveTab(stateTab);
    } else if (location.pathname.includes("favorite-trails")) {
      setActiveTab("favorite-trails");
    } else if (location.pathname.includes("hiked")) {
      setActiveTab("hiked");
    } else {
      setActiveTab("hiking");
    }
  }, [location]);

  if (loading) return <LoadingScreen />;

  const upcomingTrails = trails.filter(
    (trail) => new Date(trail.hikeDate) >= new Date()
  );
  const hikedTrails = trails.filter(
    (trail) => new Date(trail.hikeDate) < new Date()
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    location.state = null;
  };

  return (
    <div className={styles.trailsContainer}>
      {location.pathname === "/trails" && (
        <Navigate
          to={`/trails/${location.state?.activeTab || "hiking"}`}
          replace
        />
      )}
      <div>
        <h2 className={styles.heading}>{t("trails")}</h2>
        <nav className={styles.tabNavigation}>
          <Link
            to="hiking"
            className={`${styles.tab} ${
              activeTab === "hiking" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("hiking")}>
            {t("hikingTrails")}
          </Link>
          <Link
            to="hiked"
            className={`${styles.tab} ${
              activeTab === "hiked" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("hiked")}>
            {t("hikedTrails")}
          </Link>
          <Link
            to="favorite-trails"
            className={`${styles.tab} ${
              activeTab === "favorite-trails" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("favorite-trails")}>
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
    </div>
  );
};

export default Trails;
