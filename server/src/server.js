import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
import ownedGearRoutes from "./routes/ownedGearRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import PackingList from "./routes/packingListRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js";
import i18next from "./i18n.js";
import i18nextMiddleware from "i18next-http-middleware";
import pkg from "express-openid-connect";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const { auth, requiresAuth } = pkg;

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);

connectDB();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(i18nextMiddleware.handle(i18next));

const config = {
  authRequired: false, // Tillåter öppna endpoints
  auth0Logout: true, // Hanterar Auth0:s logout
  secret: process.env.SESSION_SECRET || "en-superhemlig-sträng", // Hemlighet för sessionshantering
  baseURL: "http://localhost:3001", // Din applikations bas-URL
  clientID: process.env.CLIENT_ID, // Client ID från Auth0
  clientSecret: process.env.CLIENT_SECRET, // Client Secret från Auth0
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, // Auth0-domän
};

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: "https://hikewise-api.com", // Samma Identifier/audience som ditt Auth0-API
  issuer: `https://${process.env.AUTH0_DOMAIN}/`, // Ditt Auth0-domännamn
  algorithms: ["RS256"], // Samma algoritm som du valde i Auth0
});

// Använd valideringen på dina skyddade API-endpoints
app.use("/api/protected", checkJwt, (req, res) => {
  res.json({ message: "This is a protected route", user: req.auth });
});

// Använd Auth0 middleware för autentisering
app.use(auth(config));

// Exempel på en enkel route som är skyddad
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// Lägg till dina befintliga routes och skydda dem med requiresAuth
// app.use("/api/auth", authRoutes);
app.use("/api/users", requiresAuth(), userRoutes);
app.use("/api/trails", requiresAuth(), trailRoutes);
app.use("/api/owned-gear", requiresAuth(), ownedGearRoutes);
app.use("/api/packing-list", requiresAuth(), PackingList);
app.use("/api/weather", requiresAuth(), weatherRoutes);
app.use("/api/maps", requiresAuth(), mapsRoutes);

// Ny route för att hämta översättningar
app.get("/api/translations/:lng", (req, res) => {
  const { lng } = req.params;
  const resources = i18next.getDataByLanguage(lng);

  if (!resources) {
    return res
      .status(404)
      .json({ message: "Translations not found for language" });
  }

  res.json(resources);
});

// Exempelroute för flerspråkighet
app.get("/welcome", (req, res) => {
  console.log("Detected language:", req.language);
  res.json({ message: req.t("welcome") });
});

// Debug route för att kontrollera översättningar och språkdetektering
app.get("/debug", (req, res) => {
  res.json({
    language: req.language,
    languages: req.languages,
    translations: i18next.getDataByLanguage(req.language),
  });
});

// Ny route för att logga inloggningsstatus och användarinformation
app.get("/profile", requiresAuth(), (req, res) => {
  console.log("Access token:", req.oidc.accessToken);
  res.json(req.oidc.user);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Starta servern
app.listen(PORT, () => console.log("Server is blooming".rainbow.bold));
