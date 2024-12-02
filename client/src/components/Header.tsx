import { useTranslation } from "react-i18next";
import styles from "../styles/Header.module.scss";
import Navigation from "./TopNavigation";
import useWindowSize from "../hooks/WindowSize";

const Header = () => {
  const { i18n } = useTranslation();
  const { width } = useWindowSize();

  const isDesktop = width >= 768;

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.languageContainer}>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className={styles.languageSelect}>
            <option value="en">English</option>
            <option value="sv">Svenska</option>
            <option value="ja">日本語</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>

        {isDesktop && <Navigation />}
      </div>
    </header>
  );
};

export default Header;
