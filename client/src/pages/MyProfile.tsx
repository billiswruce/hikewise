import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logout from "../components/Logout";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/MyProfile.module.scss";
import gearPlaceholder from "../assets/gearPlaceholder.jpg";
import trailPlaceholder from "../assets/trailPlaceholder.webp";
import favoritesPlaceholder from "../assets/favoritesPlaceholder.jpg";
import profilePlaceholder from "../assets/profilePlaceholder.png";
import buttonStyles from "../styles/Buttons.module.scss";
import clsx from "clsx";

const MyProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const isValidProfileImage = (url: string | undefined) => {
    return (
      url &&
      (url.includes("googleusercontent.com") ||
        url.includes("githubusercontent.com"))
    );
  };

  const profileImage = isValidProfileImage(user?.picture)
    ? user?.picture
    : profilePlaceholder;

  const handleNavigate = () => {
    navigate("/create-trail");
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <div className={styles.profileSection}>
          <img
            src={profileImage}
            alt="Profile"
            className={styles.profileImage}
          />
          <div className={buttonStyles.buttons}>
            <button
              className={clsx(buttonStyles.button, styles.createTrailButton)}
              onClick={handleNavigate}>
              {t("createTrail")}
            </button>
            <Logout />
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.userName}>{user?.name || "Anonymous"}</h1>
          <p className={styles.description}>{t("profileDescription")}</p>
        </div>
      </div>
      <div className={styles.sections}>
        <Link to="/gear" className={styles.section}>
          <div className={styles.section}>
            <img
              src={gearPlaceholder}
              alt={t("gear")}
              className={styles.sectionImage}
            />
            <span className={styles.sectionLabel}>{t("gear")}</span>
          </div>
        </Link>
        <Link to="/trails" className={styles.section}>
          <div className={styles.section}>
            <img
              src={trailPlaceholder}
              alt={t("trails")}
              className={styles.sectionImage}
            />
            <span className={styles.sectionLabel}>{t("trails")}</span>
          </div>
        </Link>
        <Link
          to="/trails"
          className={styles.section}
          state={{ activeTab: "favorite-trails" }}>
          <div className={styles.section}>
            <img
              src={favoritesPlaceholder}
              alt={t("favoriteTrails")}
              className={styles.sectionImage}
            />
            <span className={styles.sectionLabel}>{t("favoriteTrails")}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MyProfile;
