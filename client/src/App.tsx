import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";

export const App = () => {
  return (
    <FavoriteProvider>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
