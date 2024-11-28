import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

const LandingPage: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/create-trail");
  };

  return (
    <div>
      <p>{translations["homePage"] || "Home Page"}</p>
      <button onClick={handleNavigate}>
        {translations["createTrail"] || "Create Trail"}
      </button>

      <p>
        {translations["landingAfterLogin"] ||
          "This is where you land after logging in"}
      </p>
      <Logout />
    </div>
  );
};

export default LandingPage;
