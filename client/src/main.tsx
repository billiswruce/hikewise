import { createRoot } from "react-dom/client";
import "./styles/globals.scss";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.href,
      scope: "openid profile email",
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    useRefreshTokensFallback={true}>
    <App />
  </Auth0Provider>
);
