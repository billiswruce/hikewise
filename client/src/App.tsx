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
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        setSessionReady(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
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

        if (!loginResponse.ok) {
          const errorText = await loginResponse.text();
          console.error("Backend login failed:", {
            error: errorText,
            status: loginResponse.status,
          });
          setSessionReady(false);
          return;
        }

        await loginResponse.json();

        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-session`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessionData = await sessionResponse.json();

        if (sessionData.sessionActive) {
          setSessionReady(true);
        } else {
          setSessionReady(false);
        }
      } catch (error) {
        console.error(
          "Session check error:",
          error instanceof Error ? error.message : String(error)
        );
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
    return <LoadingScreen />;
  }

  if (isAuthenticated && !sessionReady) {
    return <LoadingScreen />;
  }

  return (
    <FavoriteProvider isReady={sessionReady}>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
