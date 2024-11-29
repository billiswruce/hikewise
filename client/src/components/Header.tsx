import { useLanguage } from "../context/LanguageContext";
import Navigation from "./Navigation";
import type { Language } from "../context/LanguageContext";
import styles from "./header.module.scss";

const Header: React.FC = () => {
  const { translations, setLanguage, language } = useLanguage();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.languageContainer}>
            <select
              value={language}
              onChange={handleLanguageChange}
              className={styles.languageSelect}>
              <option value="en">English</option>
              <option value="sv">Svenska</option>
              <option value="ja">日本語</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <Navigation />
        </div>
      </header>
      <h3>{translations["welcome"] || "Loading..."}</h3>
    </>
  );
};

export default Header;
