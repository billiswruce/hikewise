import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./Header";
// import BackButton from "./BackButton";
import BottomNavigation from "./BottomNavigation";

export const Layout = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Header />
      <main>
        {/* <BackButton /> */}
        <Outlet />
      </main>
      {isAuthenticated && <BottomNavigation />}
    </>
  );
};

export default Layout;
