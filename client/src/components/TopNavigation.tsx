import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/Navigation.module.scss";
import { useAuth0 } from "@auth0/auth0-react";

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

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
          <Link to="/trails">{t("trails")}</Link>
        </li>
        <li>
          <Link to="/create-trail">{t("createTrail")}</Link>
        </li>
        <li>
          <Link to="/gear">{t("gear")}</Link>
        </li>
        <li>
          <Link to="/my-profile">{t("myProfile")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
