import { useLanguage } from "../context/LanguageContext";

const Map = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["map"] || "Map"}</h1>
    </div>
  );
};

export default Map;
