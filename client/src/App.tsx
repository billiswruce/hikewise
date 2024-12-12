import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";

export const App = () => {
  const [apiData, setApiData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setApiData(data.message);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <FavoriteProvider>
        <RouterProvider router={router} />
        {apiData && (
          <p style={{ textAlign: "center" }}>Backend säger: {apiData}</p>
        )}
      </FavoriteProvider>
    </>
  );
};

export default App;
