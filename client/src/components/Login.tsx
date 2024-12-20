import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.scss";
import LoginModal from "../components/LoginModal";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogin = () => {
    localStorage.setItem("selectedLanguage", i18n.language);
    loginWithRedirect();
  };

  useEffect(() => {
    const loginToBackend = async () => {
      if (!isAuthenticated || !user) return;
      console.log("Auth0 User data:", user);
      console.log("Inlogg till backend");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Användare sparad på backend:", data);
          setShowModal(true); // Visa modalen
        } else {
          console.error("Server error:", response.statusText);
        }
      } catch (error) {
        console.error("Fel vid inloggning på backend:", error);
      }
    };

    loginToBackend();
  }, [isAuthenticated, user]);

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={handleLogin} className={styles.button}>
          {t("startPlanning")}
        </button>
      )}

      <LoginModal isOpen={showModal} onClose={() => navigate("/my-profile")} />
    </div>
  );
};

export default Login;
