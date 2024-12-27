import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const {
    isAuthenticated,
    getAccessTokenSilently,
    user,
    isLoading: auth0Loading,
  } = useAuth0();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      if (!isAuthenticated || !user) {
        console.log(
          "Not authenticated or no user data, skipping session check"
        );
        setIsLoading(false);
        setSessionReady(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();

        // Först, försök att refresha sessionen
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-session`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Origin: window.location.origin,
            },
            mode: "cors",
          }
        );

        if (!refreshResponse.ok) {
          throw new Error(`Refresh failed: ${await refreshResponse.text()}`);
        }

        const refreshData = await refreshResponse.json();
        console.log("Session refresh complete:", refreshData);

        // Vänta på att backend-sessionen etableras
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Försök att logga in på backend
        const loginResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
            }),
          }
        );

        if (loginResponse.ok) {
          console.log("Backend login successful");
          setSessionReady(true);
        } else {
          const errorText = await loginResponse.text();
          console.log("Backend login failed:", errorText);
          setSessionReady(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setSessionReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth0Loading && isAuthenticated) {
      checkSession();
    } else if (!auth0Loading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently, auth0Loading, user]);

  if (auth0Loading || isLoading) {
    console.log("Loading screen:", { auth0Loading, isLoading });
    return <LoadingScreen />;
  }

  if (isAuthenticated && !sessionReady) {
    console.log("Waiting for session to be ready");
    return <LoadingScreen />;
  }

  return (
    <FavoriteProvider isReady={sessionReady}>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
