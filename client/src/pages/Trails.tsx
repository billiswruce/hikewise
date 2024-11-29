import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Trails = () => {
  const { translations } = useLanguage();

  return (
    <div>
      <h2>{translations["trails"] || "Trails"}</h2>
      <nav>
        <ul>
          <li>
            <Link to="hiked">{translations["hikedTrails"] || "Hiked"}</Link>
          </li>
          <li>
            <Link to="hiking">{translations["hikingTrails"] || "Hiking"}</Link>
          </li>
          <li>
            <Link to="favorite-trails">
              {translations["favoriteTrails"] || "Favorite Trails"}
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Trails;
