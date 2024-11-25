import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export const Layout = () => {
  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
