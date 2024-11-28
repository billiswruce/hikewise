import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";

export const Layout = () => {
  return (
    <div>
      <Header />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
