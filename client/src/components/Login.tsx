import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.scss";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loginToBackend = async () => {
      if (!isAuthenticated || !user) return;
      console.log("Auth0 User data:", user);
      console.log("Inloggningsförsök till backend");
      try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            name: user.name,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Användare sparad på backend:", data);
          navigate("/my-profile");
        } else {
          console.error("Server error:", response.statusText);
        }
      } catch (error) {
        console.error("Fel vid inloggning på backend:", error);
      }
    };

    loginToBackend();
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()} className={styles.button}>
          {t("startPlanning")}
        </button>
      )}
    </div>
  );
};

export default Login;
