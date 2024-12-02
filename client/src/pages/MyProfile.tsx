import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logout from "../components/Logout";
import { useAuth0 } from "@auth0/auth0-react";

const MyProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth0();

  const handleNavigate = () => {
    navigate("/create-trail");
  };

  return (
    <div>
      <h1>{t("myProfile")}</h1>
      <div>
        <p>
          {t("welcomeUser")}, {user?.name}
        </p>
        <button onClick={handleNavigate}>{t("createTrail")}</button>
        <Logout />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="gear">{t("gear")}</Link>
          </li>
          <li>
            <Link to="trails">{t("trails")}</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default MyProfile;
