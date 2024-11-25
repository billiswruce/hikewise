import React, { createContext, useContext, useState, useEffect } from "react";

// Typ för tillgängliga språk
type Language = "en" | "sv" | "ja";

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
  const [language, setLanguage] = useState<Language>("en"); // Default: engelska
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocale = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/translations/${language}`
        ); // Din API-endpoint
        if (!response.ok) {
          throw new Error(`Error fetching locale: ${response.statusText}`);
        }

        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to fetch locale:", error);
      } finally {
        setLoading(false); // Indikera att hämtningen är klar
      }
    };

    fetchLocale();
  }, [language]);

  if (loading) {
    return <p>Loading language...</p>; // Rendera en laddningsindikator medan språk laddas
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook för att använda kontexten
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
