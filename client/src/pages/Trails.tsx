import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Trails = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("trails")}</h2>
      <nav>
        <ul>
          <li>
            <Link to="hiked">{t("hikedTrails")}</Link>
          </li>
          <li>
            <Link to="hiking">{t("hikingTrails")}</Link>
          </li>
          <li>
            <Link to="favorite-trails">{t("favoriteTrails")}</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Trails;
