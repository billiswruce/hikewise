import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Hiking.module.scss";
import trailPlaceholder from "../assets/trailPlaceholder.jpg";

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

const Hiking = () => {
  const { t } = useTranslation();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "hiked" | "favorites"
  >("upcoming");
  const { user } = useAuth0();

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

  const filteredTrails =
    activeTab === "upcoming"
      ? trails.filter((trail) => new Date(trail.hikeDate) >= new Date())
      : activeTab === "hiked"
      ? trails.filter((trail) => new Date(trail.hikeDate) < new Date())
      : trails.filter((trail) => trail.creatorId === user?.sub); // Example for favorites

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className={styles.hikingContainer}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${
            activeTab === "upcoming" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("upcoming")}>
          {t("Upcoming Trails")}
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "hiked" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("hiked")}>
          {t("Hiked Trails")}
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "favorites" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("favorites")}>
          {t("Favorite Trails")}
        </button>
      </div>

      {/* Trail Sections */}
      <div className={styles.sections}>
        {filteredTrails.map((trail) => (
          <div key={trail.id} className={styles.section}>
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

export default Hiking;
