import { Link, Outlet } from "react-router-dom";

export const Trails = () => {
  return (
    <div>
      <h2>Trails</h2>
      <nav>
        <ul>
          <li>
            <Link to="hiked">Hiked</Link>{" "}
            {/* Navigerar till /my-profile/trails/hiked */}
          </li>
          <li>
            <Link to="hiking">Hiking</Link>{" "}
            {/* Navigerar till /my-profile/trails/hiking */}
          </li>
          <li>
            <Link to="favorite-trails">Favorite Trails</Link>{" "}
            {/* Navigerar till /my-profile/trails/favorite-trails */}
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Här visas undersidorna */}
    </div>
  );
};

export default Trails;
