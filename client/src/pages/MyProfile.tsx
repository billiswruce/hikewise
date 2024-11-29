import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Logout from "../components/Logout";
import { useAuth0 } from "@auth0/auth0-react";

const MyProfile = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const handleNavigate = () => {
    navigate("/create-trail");
  };

  return (
    <div>
      <h1>{translations["myProfile"] || "My Profile"}</h1>
      <div>
        <p>
          {translations["welcomeUser"] || "Välkommen"}, {user?.name}
        </p>
        <button onClick={handleNavigate}>
          {translations["createTrail"] || "Create Trail"}
        </button>
        <Logout />
      </div>
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
