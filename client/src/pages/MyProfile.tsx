import { Link, Outlet } from "react-router-dom";

export const MyProfile = () => {
  return (
    <div>
      <h1>My Profile</h1>
      <nav>
        <ul>
          <li>
            <Link to="gear">Gear</Link> {/* Navigerar till /my-profile/gear */}
          </li>
          <li>
            <Link to="trails">Trails</Link>{" "}
            {/* Navigerar till /my-profile/trails */}
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Här visas barnrutterna */}
    </div>
  );
};

export default MyProfile;
