import { useLanguage } from "../context/LanguageContext";

const ProtectedPage = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["protectedPage"] || "Protected Page"}</h1>
      <p>
        {translations["protectedPageDescription"] ||
          "This page is only accessible to authenticated users."}
      </p>
    </div>
  );
};

export default ProtectedPage;
