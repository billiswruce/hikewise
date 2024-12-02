import { useTranslation } from "react-i18next";

const Hiked = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("hikedTrails")}</h3>
      <p>{t("listOfHikedTrails")}</p>
    </div>
  );
};

export default Hiked;
