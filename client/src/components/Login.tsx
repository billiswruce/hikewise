import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.scss";
import LoginModal from "../components/LoginModal";
import CookieBanner from "./CookieBanner";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    if (hasAcceptedCookies) {
      setCookiesAccepted(true);
    }
  }, [i18n]);

  const handleLogin = () => {
    if (!cookiesAccepted) return;
    localStorage.setItem("selectedLanguage", i18n.language);
    loginWithRedirect();
  };

  const handleCookieAccept = () => {
    setCookiesAccepted(true);
  };

  useEffect(() => {
    const loginToBackend = async () => {
      if (!isAuthenticated || !user) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Session established:", data);
          setTimeout(() => setShowModal(true), 500);
        }
      } catch (error) {
        console.error("Backend login error:", error);
      }
    };

    loginToBackend();
  }, [isAuthenticated, user, navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      navigate("/my-profile");
    }
  };

  return (
    <div>
      {!isAuthenticated && (
        <>
          <button
            onClick={handleLogin}
            className={`${styles.button} ${
              !cookiesAccepted ? styles.disabled : ""
            }`}
            disabled={!cookiesAccepted}>
            {t("startPlanning")}
          </button>
          <CookieBanner onAccept={handleCookieAccept} />
        </>
      )}

      <LoginModal isOpen={showModal} onClose={handleModalClose} />
    </div>
  );
};

export default Login;
