import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navigation.module.scss";

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.nav}>
      <button
        className={styles.hamburger}
        aria-label="Toggle navigation"
        onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`${styles.menu} ${menuOpen ? styles.active : ""}`}>
        <li>
          <Link to="/landing-page">Home Page</Link>
        </li>
        <li>
          <Link to="/create-trail">Create Trail</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/my-profile">My Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
