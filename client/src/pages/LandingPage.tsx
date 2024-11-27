import Login from "../components/Login";
import LogoutButton from "../components/LogoutButton";

export const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <p>Here you register and log in</p>
      <Login />
      <LogoutButton />
    </div>
  );
};

export default LandingPage;
