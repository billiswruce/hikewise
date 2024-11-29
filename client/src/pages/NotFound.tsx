import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["notFound"] || "Not Found"}</h1>
    </div>
  );
};

export default NotFound;
