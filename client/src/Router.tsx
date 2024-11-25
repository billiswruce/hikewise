import { createBrowserRouter } from "react-router-dom";
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
        element: <LandingPage />,
      },
      {
        path: "/create-trail",
        element: <CreateTrail />,
      },
      {
        path: "/map",
        element: <Map />,
      },
      {
        path: "/my-profile",
        element: <MyProfile />,
        children: [
          {
            path: "gear",
            element: <Gear />,
          },
          {
            path: "trails",
            element: <Trails />,
            children: [
              {
                path: "hiked",
                element: <Hiked />,
              },
              {
                path: "hiking",
                element: <Hiking />,
              },
              {
                path: "favorite-trails",
                element: <FavoriteTrails />,
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
