import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/landing-page">Landing Page</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/create-trail">Create Trail</Link>
        </li>
        <li>
          <Link to="/map">Map</Link>
        </li>
        <li>
          <Link to="/my-profile">My Profile</Link>
        </li>
        <li>
          <Link to="/test-translations">Test Translations</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
