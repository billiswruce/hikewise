import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import CreateTrail from "./pages/CreateTrail";
import MyProfile from "./pages/MyProfile";
import Gear from "./pages/Gear";
import Trails from "./pages/Trails";
import Hiked from "./pages/Hiked";
import Hiking from "./pages/Hiking";
import FavoriteTrails from "./pages/FavoriteTrails";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/create-trail",
        element: <ProtectedRoute element={<CreateTrail />} />,
      },
      {
        path: "/gear",
        element: <ProtectedRoute element={<Gear />} />,
      },
      {
        path: "/trails",
        element: <ProtectedRoute element={<Trails />} />,
        children: [
          {
            path: "hiked",
            element: <ProtectedRoute element={<Hiked />} />,
          },
          {
            path: "hiking",
            element: <ProtectedRoute element={<Hiking />} />,
          },
          {
            path: "favorite-trails",
            element: <ProtectedRoute element={<FavoriteTrails />} />,
          },
        ],
      },
      {
        path: "/favorites",
        element: <ProtectedRoute element={<FavoriteTrails />} />,
      },
      {
        path: "/my-profile",
        element: <ProtectedRoute element={<MyProfile />} />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
