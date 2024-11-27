import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

const Login = () => {
  const { loginWithRedirect, getIdTokenClaims, isAuthenticated, user } =
    useAuth0();

  useEffect(() => {
    const loginToBackend = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getIdTokenClaims();
        const response = await axios.post(
          "http://localhost:3001/api/auth/login",
          {
            token: token?.__raw,
          }
        );
        console.log("Användare sparad på backend:", response.data);
      } catch (error) {
        console.error("Fel vid inloggning på backend:", error);
      }
    };

    loginToBackend();
  }, [isAuthenticated, getIdTokenClaims]); // Kör när användaren är autentiserad

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Logga in</button>
      )}
      {isAuthenticated && (
        <div>
          <p>Välkommen, {user?.name}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
