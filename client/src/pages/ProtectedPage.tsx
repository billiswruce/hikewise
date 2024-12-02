import { useTranslation } from "react-i18next";

const ProtectedPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("protectedPage")}</h1>
      <p>{t("protectedPageDescription")}</p>
    </div>
  );
};

export default ProtectedPage;
