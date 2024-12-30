import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Footer from "./Footer";

export const Layout = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="app-container">
      <Header />
      <main>
        <Outlet />
      </main>
      {isAuthenticated && <BottomNavigation />}
      <Footer />
    </div>
  );
};

export default Layout;
