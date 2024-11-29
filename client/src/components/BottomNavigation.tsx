import React from "react";
import { Link } from "react-router-dom";
import trailsIcon from "../assets/box-archive-solid.svg";
import mapIcon from "../assets/map-regular.svg";
import gearIcon from "../assets/box-archive-solid.svg";
import accountIcon from "../assets/person-hiking-solid.svg";
import styles from "../styles/bottomNavigation.module.scss";

const BottomNavigation: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <Link to="/create-trail" className={styles.navItem}>
        <img src={trailsIcon} alt="Trails" className={styles.icon} />
        <span>Trails</span>
      </Link>
      <Link to="/map" className={styles.navItem}>
        <img src={mapIcon} alt="Map" className={styles.icon} />
        <span>Map</span>
      </Link>
      <Link to="gear" className={styles.navItem}>
        <img src={gearIcon} alt="Gear" className={styles.icon} />
        <span>Gear</span>
      </Link>
      <Link to="/my-profile" className={styles.navItem}>
        <img src={accountIcon} alt="Account" className={styles.icon} />
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
