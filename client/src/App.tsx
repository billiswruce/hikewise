import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

// Gör ett anrop till vercel, för att se om vi är inloggade (inga parametrar som användarnamn eller lösenord, förlitar oss på cookien) /getme
// när vi får svar, om svaret innehåller användardataså är användaren inloggad, annars går vi vidare med useAuth0,
// när vi får svar från useAuth0, så anropa login på server med andändarnamn och lösenord

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    isAuthenticated,
    getAccessTokenSilently,
    isLoading: auth0Loading,
  } = useAuth0();

  useEffect(() => {
    const checkSession = async () => {
      console.log("checkSession");
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-session`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Origin: window.location.origin,
            },
            mode: "cors",
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
                Origin: window.location.origin,
              },
              mode: "cors",
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
    } else {
      console.log("isAuthenticated is false");
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (auth0Loading) {
    console.log("auth0Loading");
    return <LoadingScreen />;
  }

  if (isLoading) {
    console.log("isLoading");
    return <LoadingScreen />;
  }
  console.log("FavoriteProvider");

  return (
    <FavoriteProvider>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
