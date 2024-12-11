import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import styles from "../styles/Buttons.module.scss";
const Logout = () => {
  const { logout } = useAuth0();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out from backend...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Backend session successfully ended");
        console.log("Logging out from Auth0...");
        logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        console.error("Backend logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.button}>
      {t("logout")}
    </button>
  );
};

export default Logout;
