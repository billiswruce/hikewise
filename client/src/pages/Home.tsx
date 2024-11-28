import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Login from "../components/Login";

const Home: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["landingPage"] || "Landing Page"}</h1>
      <p>{translations["registerLogin"] || "Here you register and log in"}</p>
      <Login />
    </div>
  );
};

export default Home;
