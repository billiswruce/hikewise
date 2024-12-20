import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

export const App = () => {
  const [apiData, setApiData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //   Gör ett anrop till vercel, för att se om vi är inloggade (inga parametrar som användarnamn eller lösenord, förlitar oss på cookien) /getme
  // när vi får svar, om svaret innehåller användardataså är användaren inloggad, annars går vi vidare med useAuth0,
  // när vi får svar från useAuth0, så anropa login på server med andändarnamn och lösenord
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched data:", data, JSON.stringify(data));
          setApiData(data.message);
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);
  console.log(isAuthenticated);
  return (
    <>
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <FavoriteProvider>
          <RouterProvider router={router} />
          {isAuthenticated && apiData && (
            <p style={{ textAlign: "center" }}>Backend säger: {apiData}</p>
          )}
        </FavoriteProvider>
      )}
    </>
  );
};

export default App;
