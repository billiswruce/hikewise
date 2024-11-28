import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    const loginToBackend = async () => {
      if (!isAuthenticated || !user) return;

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
        <button onClick={() => loginWithRedirect()}>Logga in</button>
      )}
      {isAuthenticated && user && (
        <div>
          <p>Välkommen, {user.name}</p>
          <p>Ditt Auth0 ID är: {user.sub}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
