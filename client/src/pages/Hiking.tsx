import { useLanguage } from "../context/LanguageContext";

const Hiking = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h3>{translations["hikingTrails"] || "Hiking Trails"}</h3>
      <p>
        {translations["currentlyHikingTrails"] || "Currently hiking trails..."}
      </p>
    </div>
  );
};

export default Hiking;
