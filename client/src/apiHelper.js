import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const fetchProtectedData = async () => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently({
      audience: "https://hikewise-api.com",
      scope: "openid profile email read:trails write:trails",
    });

    const response = await axios.get("http://localhost:3001/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error;
  }
};
