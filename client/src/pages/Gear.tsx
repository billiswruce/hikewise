import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Gear: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["gear"] || "Gear"}</h1>
      <p>{translations["categories"] || "Categories etc!"}</p>
    </div>
  );
};

export default Gear;
