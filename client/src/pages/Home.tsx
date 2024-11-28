import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Home: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>
        {translations["homePage"] ||
          "Home Page - Click this button and create a trail"}
      </h1>
      <p>
        {translations["landingAfterLogin"] ||
          "This is where you land after logging in"}
      </p>
    </div>
  );
};

export default Home;
