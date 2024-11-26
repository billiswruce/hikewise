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
import session from "express-session";
// import passport from "./passport.js";
import i18next from "./i18n.js";
import i18nextMiddleware from "i18next-http-middleware";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 6000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(i18nextMiddleware.handle(i18next));

// Lägg till session och passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());
// Middleware för i18next

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

// Root route (med översättning)
app.get("/", (req, res) => {
  res.send(req.t("Server is running"));
});

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
