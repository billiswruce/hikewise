import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("notFound")}</h1>
    </div>
  );
};

export default NotFound;
