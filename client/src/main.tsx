import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { Auth0Provider } from "@auth0/auth0-react";

// Logga Auth0-konfigurationen för att säkerställa att miljövariablerna laddas korrekt
console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-xd3jckbyc4yzmut8.us.auth0.com"
      clientId="MjwDHSDicGiCRjv8gZGNe6JalrHjDlye"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://hikewise-api.com", // Identifier från Auth0
        scope: "openid profile email read:trails write:trails", // Lägg till de scopes du behöver
      }}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Auth0Provider>
  </StrictMode>
);
