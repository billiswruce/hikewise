import { createRoot } from "react-dom/client";
import "./styles/globals.scss";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./i18n";

console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-xd3jckbyc4yzmut8.us.auth0.com"
    clientId="SXDEoMwEZgARlsbdGlnxiXiNWqTEkpJI"
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: "openid profile email",
    }}>
    <App />
  </Auth0Provider>
);
