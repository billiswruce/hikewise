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

// import { useAuth0 } from "@auth0/auth0-react";

// const MyProfile = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   if (isLoading) {
//     return <div>Loading ...</div>;
//   }

//   return (
//     isAuthenticated && (
//       <div>
//         <img src={user.picture} alt={user.name} />
//         <h2>{user.name}</h2>
//         <p>{user.email}</p>
//       </div>
//     )
//   );
// };

// export default MyProfile;
