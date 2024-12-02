import { useTranslation } from "react-i18next";

const Gear = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("gear")}</h1>
      <p>{t("categories")}</p>
    </div>
  );
};

export default Gear;
