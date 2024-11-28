import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";

const Logout = () => {
  const { logout } = useAuth0();
  const { translations } = useLanguage();

  const handleLogout = async () => {
    try {
      // Logga ut från backend först
      console.log("Attempting to log out from backend...");
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Backend session successfully ended");
        // Om backend-utloggningen lyckas, logga ut från Auth0
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
    <button onClick={handleLogout}>
      {translations["logout"] || "Log out"}
    </button>
  );
};

export default Logout;
