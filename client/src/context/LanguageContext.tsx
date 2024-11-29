import React, { createContext, useContext, useState, useEffect } from "react";

// Typ för tillgängliga språk
export type Language = "en" | "sv" | "ja" | "fr" | "es";

// Kontextens värden
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
}

// Skapa en kontext
const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

// Provider-komponent
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Hämta sparat språk från localStorage eller använd "en" som default
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    return (savedLanguage as Language) || "en";
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const handleSetLanguage = (newLanguage: Language) => {
    localStorage.setItem("selectedLanguage", newLanguage);
    setLanguage(newLanguage);
  };

  useEffect(() => {
    const fetchLocale = async () => {
      console.log("Fetching locale for language:", language);
      try {
        const response = await fetch(
          `http://localhost:3001/api/translations/${language}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching locale: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received translations:", data);
        setTranslations(data.translation || {});
      } catch (error) {
        console.error("Failed to fetch locale:", error);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    fetchLocale();
  }, [language]);

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        translations,
      }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook för att använda språkkontexten
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
