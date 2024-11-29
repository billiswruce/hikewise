import { useLanguage } from "../context/LanguageContext";

const CreateTrail = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["createTrail"] || "Create a Trail"}</h1>
    </div>
  );
};

export default CreateTrail;
