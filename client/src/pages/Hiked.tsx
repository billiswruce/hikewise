import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Hiked: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h3>{translations["hikedTrails"] || "Hiked Trails"}</h3>
      <p>{translations["listOfHikedTrails"] || "List of hiked trails..."}</p>
    </div>
  );
};

export default Hiked;
