import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../context/LanguageContext";

const Header: React.FC = () => {
  const { translations, setLanguage } = useLanguage();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <header>
      <h1>{translations["welcome"] || "Loading..."}</h1>
      <select onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="sv">Svenska</option>
        <option value="ja">日本語</option>
        <option value="fr">Français</option>
      </select>
    </header>
  );
};

export default Header;
