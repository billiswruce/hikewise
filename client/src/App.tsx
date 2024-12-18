import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

export const App = () => {
  const [apiData, setApiData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched data:", data);
          setApiData(data.message);
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <FavoriteProvider>
        <RouterProvider router={router} />
        {isAuthenticated && apiData && (
          <p style={{ textAlign: "center" }}>Backend säger: {apiData}</p>
        )}
      </FavoriteProvider>
    </>
  );
};

export default App;
