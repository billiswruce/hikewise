import { useTranslation } from "react-i18next";

const FavoriteTrails = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("favoriteTrails")}</h3>
      <p>{t("listOfFavoriteTrails")}</p>
    </div>
  );
};

export default FavoriteTrails;
