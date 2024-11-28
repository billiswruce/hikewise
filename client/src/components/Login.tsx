import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const { translations } = useLanguage();
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
          navigate("/landing-page");
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
        <button onClick={() => loginWithRedirect()}>
          {translations["login"] || "Logga in"}
        </button>
      )}
      {isAuthenticated && user && (
        <div>
          <p>{translations["welcome"] || "Loading..."}</p>
          <p>
            {translations["welcomeUser"] || "Välkommen"}, {user.name}
          </p>
          <p>
            {translations["auth0Id"] || "Ditt Auth0 ID är"}: {user.sub}
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
