import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const handleNavigate = () => {
    navigate("/create-trail");
  };

  return (
    <div>
      <p>
        {translations["welcomeUser"] || "Välkommen"}, {user?.name}
      </p>
      <button onClick={handleNavigate}>
        {translations["createTrail"] || "Create Trail"}
      </button>
      <Logout />
    </div>
  );
};

export default LandingPage;
