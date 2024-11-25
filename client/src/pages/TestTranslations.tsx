import React, { useEffect, useState } from "react";

const TestTranslations: React.FC = () => {
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/translations/ja"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch translations");
        }

        const data = await response.json();
        console.log("Fetched translations:", data);
        setTranslations(data.translation);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, []);

  return (
    <div>
      <h1>{translations.welcome}</h1>
      <p>{translations.serverRunning}</p>
      <p>{translations.error}</p>
    </div>
  );
};

export default TestTranslations;
