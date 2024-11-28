import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import i18next from "./i18n.js";
import i18nextMiddleware from "i18next-http-middleware";
import authRoutes from "./routes/authRoutes.js";
import ownedGearRoutes from "./routes/ownedGearRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import PackingList from "./routes/packingListRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(i18nextMiddleware.handle(i18next));

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
  console.log("Requested language:", lng);
  const resources = i18next.getResourceBundle(lng, "translation");
  console.log("Found resources:", resources);

  if (!resources) {
    return res
      .status(404)
      .json({ message: "Translations not found for language" });
  }

  res.json({ translation: resources });
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
app.listen(PORT, () =>
  console.log(`Server is blooming on http://localhost:${PORT}`.rainbow.bold)
);
