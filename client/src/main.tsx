import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { Auth0Provider } from "@auth0/auth0-react";

console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-xd3jckbyc4yzmut8.us.auth0.com"
      clientId="SXDEoMwEZgARlsbdGlnxiXiNWqTEkpJI"
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email",
      }}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Auth0Provider>
  </StrictMode>
);
