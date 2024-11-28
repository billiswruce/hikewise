import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const MyProfile: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h1>{translations["myProfile"] || "My Profile"}</h1>
      <nav>
        <ul>
          <li>
            <Link to="gear">{translations["gear"] || "Gear"}</Link>
          </li>
          <li>
            <Link to="trails">{translations["trails"] || "Trails"}</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default MyProfile;
