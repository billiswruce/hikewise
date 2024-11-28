import React from "react";
import { useLanguage } from "../context/LanguageContext";

const FavoriteTrails: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h3>{translations["favoriteTrails"] || "Favorite Trails"}</h3>
      <p>
        {translations["listOfFavoriteTrails"] || "List of favorite trails..."}
      </p>
    </div>
  );
};

export default FavoriteTrails;
