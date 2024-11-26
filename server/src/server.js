import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ownedGearRoutes from "./routes/ownedGearRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import PackingList from "./routes/packingListRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js";
import i18next from "./i18n.js";
import i18nextMiddleware from "i18next-http-middleware";
import { auth } from "express-openid-connect";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(i18nextMiddleware.handle(i18next));

// Auth0-konfiguration för express-openid-connect
const config = {
  authRequired: false, // Tillåter att vissa sidor är tillgängliga utan inloggning
  auth0Logout: true, // Tillåter Auth0 att hantera utloggning
  secret: process.env.JWT_SECRET, // Lång hemlighet lagrad i .env
  baseURL: "http://localhost:3001", // Den URL som applikationen körs på
  clientID: process.env.CLIENT_ID, // Din Auth0 Client ID
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, // Din Auth0 domän
};

// Använd Auth0 middleware för autentisering
app.use(auth(config));

// Exempel på en enkel route som är skyddad
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// Lägg till dina befintliga routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/owned-gear", ownedGearRoutes);
app.use("/api/packing-list", PackingList);
app.use("/api/weather", weatherRoutes);
app.use("/api/maps", mapsRoutes);

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

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Starta servern
app.listen(PORT, () => console.log("Server is blooming".rainbow.bold));
