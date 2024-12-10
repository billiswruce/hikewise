import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";

export const App = () => {
  const [apiData, setApiData] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://hikewise-backend-lu3c9nfbe-jessicatell-hotmailcoms-projects.vercel.app/api/hello"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setApiData(data.message);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <FavoriteProvider>
      <RouterProvider router={router} />
      {apiData && (
        <p style={{ textAlign: "center" }}>Backend säger: {apiData}</p>
      )}
    </FavoriteProvider>
  );
};

export default App;
