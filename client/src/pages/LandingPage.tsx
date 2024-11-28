import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Login from "../components/Login";
import LogoutButton from "../components/LogoutButton";

const LandingPage: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["landingPage"] || "Landing Page"}</h1>
      <p>{translations["registerLogin"] || "Here you register and log in"}</p>
      <Login />
      <LogoutButton />
    </div>
  );
};

export default LandingPage;
