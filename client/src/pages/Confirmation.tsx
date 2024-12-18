import { useTranslation } from "react-i18next";

const Confirmation = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("Confirmation")}</h1>
    </div>
  );
};

export default Confirmation;
