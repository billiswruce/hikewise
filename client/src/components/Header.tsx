import { useLanguage } from "../context/LanguageContext";

const Header: React.FC = () => {
  const { translations, setLanguage } = useLanguage();

  return (
    <header>
      <h1>{translations["welcome"] || "Loading..."}</h1>
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("sv")}>Svenska</button>
      <button onClick={() => setLanguage("ja")}>日本語</button>
    </header>
  );
};

export default Header;
