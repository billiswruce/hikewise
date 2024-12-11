import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import trailsIcon from "../assets/box-archive-solid.svg";
import mapIcon from "../assets/map-regular.svg";
import gearIcon from "../assets/box-archive-solid.svg";
import accountIcon from "../assets/person-hiking-solid.svg";
import styles from "../styles/BottomNavigation.module.scss";

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <Link to="/trails" className={styles.navItem}>
        <img src={trailsIcon} alt={t("trails")} className={styles.icon} />
        <span>{t("trails")}</span>
      </Link>
      <Link to="/create-trail" className={styles.navItem}>
        <img src={mapIcon} alt={t("createTrail")} className={styles.icon} />
        <span>{t("createTrail")}</span>
      </Link>
      <Link to="gear" className={styles.navItem}>
        <img src={gearIcon} alt={t("gear")} className={styles.icon} />
        <span>{t("gear")}</span>
      </Link>
      <Link to="/my-profile" className={styles.navItem}>
        <img src={accountIcon} alt={t("myProfile")} className={styles.icon} />
        <span>{t("myProfile")}</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
