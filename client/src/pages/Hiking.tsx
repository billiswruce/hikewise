import { useTranslation } from "react-i18next";

const Hiking = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("hikingTrails")}</h3>
      <p>{t("currentlyHikingTrails")}</p>
    </div>
  );
};

export default Hiking;
