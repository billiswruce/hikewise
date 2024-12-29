import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import mapIcon from "../assets/map-regular.svg";
import gearIcon from "../assets/box-archive-solid.svg";
import accountIcon from "../assets/person-hiking-solid.svg";
import mountainIcon from "../assets/route.svg";
import styles from "../styles/BottomNavigation.module.scss";

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <Link to="/trails" className={styles.navItem}>
        <img
          src={mountainIcon}
          alt=""
          className={styles.icon}
          role="presentation"
        />
        <span>{t("trails")}</span>
      </Link>
      <Link to="/create-trail" className={styles.navItem}>
        <img src={mapIcon} alt="" className={styles.icon} role="presentation" />
        <span>{t("createTrail")}</span>
      </Link>
      <Link to="gear" className={styles.navItem}>
        <img
          src={gearIcon}
          alt=""
          className={styles.icon}
          role="presentation"
        />
        <span>{t("gear")}</span>
      </Link>
      <Link to="/my-profile" className={styles.navItem}>
        <img
          src={accountIcon}
          alt=""
          className={styles.icon}
          role="presentation"
        />
        <span>{t("myProfile")}</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
