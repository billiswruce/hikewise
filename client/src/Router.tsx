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
import SingleTrail from "./pages/SingleTrail";
import Confirmation from "./pages/Confirmation";

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
        path: "/confirmation",
        element: <ProtectedRoute element={<Confirmation />} />,
      },
      {
        path: "/trails",
        element: <ProtectedRoute element={<Trails />} />,
        children: [
          {
            index: true,
            element: <ProtectedRoute element={<Hiking />} />,
          },
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
        path: "/trail/:id",
        element: <ProtectedRoute element={<SingleTrail />} />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
