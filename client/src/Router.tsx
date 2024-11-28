import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import CreateTrail from "./pages/CreateTrail";
import Map from "./pages/Map";
import MyProfile from "./pages/MyProfile";
import Gear from "./pages/Gear";
import Trails from "./pages/Trails";
import Hiked from "./pages/Hiked";
import Hiking from "./pages/Hiking";
import FavoriteTrails from "./pages/FavoriteTrails";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

import { ReactElement } from "react";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? element : <Navigate to="/" />;
};

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
        path: "/landing-page",
        element: <ProtectedRoute element={<LandingPage />} />,
      },
      {
        path: "/create-trail",
        element: <ProtectedRoute element={<CreateTrail />} />,
      },
      {
        path: "/map",
        element: <ProtectedRoute element={<Map />} />,
      },
      {
        path: "/my-profile",
        element: <ProtectedRoute element={<MyProfile />} />,
        children: [
          {
            path: "gear",
            element: <ProtectedRoute element={<Gear />} />,
          },
          {
            path: "trails",
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
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
