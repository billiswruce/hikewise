import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { FavoriteProvider } from "./context/FavoriteContext";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const {
    isAuthenticated,
    getAccessTokenSilently,
    user,
    isLoading: auth0Loading,
  } = useAuth0();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      if (!isAuthenticated || !user) {
        console.log(
          JSON.stringify(
            {
              message:
                "Not authenticated or no user data, skipping session check",
              isAuthenticated,
              hasUser: !!user,
            },
            null,
            2
          )
        );
        setIsLoading(false);
        setSessionReady(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const loginResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
            }),
          }
        );

        if (!loginResponse.ok) {
          const errorText = await loginResponse.text();
          console.log(
            JSON.stringify(
              {
                message: "Backend login failed",
                error: errorText,
                status: loginResponse.status,
              },
              null,
              2
            )
          );
          setSessionReady(false);
          return;
        }

        const loginData = await loginResponse.json();
        console.log(
          JSON.stringify(
            {
              message: "Backend login successful",
              data: loginData,
            },
            null,
            2
          )
        );

        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-session`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessionData = await sessionResponse.json();
        console.log(
          JSON.stringify(
            {
              message: "Session check response",
              data: sessionData,
            },
            null,
            2
          )
        );

        if (sessionData.sessionActive) {
          console.log(
            JSON.stringify(
              {
                message: "Session verified as active",
                sessionId: sessionData.sessionId,
              },
              null,
              2
            )
          );
          setSessionReady(true);
        } else {
          console.log(
            JSON.stringify(
              {
                message: "Session verification failed",
                data: sessionData,
              },
              null,
              2
            )
          );
          setSessionReady(false);
        }
      } catch (error) {
        console.error(
          JSON.stringify(
            {
              message: "Session check error",
              error: error instanceof Error ? error.message : String(error),
            },
            null,
            2
          )
        );
        setSessionReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth0Loading && isAuthenticated) {
      checkSession();
    } else if (!auth0Loading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently, auth0Loading, user]);

  if (auth0Loading || isLoading) {
    console.log(
      JSON.stringify(
        {
          message: "Loading screen",
          auth0Loading,
          isLoading,
        },
        null,
        2
      )
    );
    return <LoadingScreen />;
  }

  if (isAuthenticated && !sessionReady) {
    console.log(
      JSON.stringify(
        {
          message: "Waiting for session to be ready",
          isAuthenticated,
          sessionReady,
        },
        null,
        2
      )
    );
    return <LoadingScreen />;
  }

  return (
    <FavoriteProvider isReady={sessionReady}>
      <RouterProvider router={router} />
    </FavoriteProvider>
  );
};

export default App;
