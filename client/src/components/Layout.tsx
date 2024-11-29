import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

export const Layout = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

export default Layout;
