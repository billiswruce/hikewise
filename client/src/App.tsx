import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const checkSession = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-session`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const sessionData = await sessionResponse.json();
        if (!sessionData.sessionActive) {
          const token = await getAccessTokenSilently();
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-session`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      checkSession();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <FavoriteProvider>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
