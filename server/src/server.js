import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import ownedGearRoutes from "./routes/ownedGearRoutes.js";
import packingListRoutes from "./routes/packingListRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware för att logga cookies
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// CORS-konfiguration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hikewise.vercel.app",
      "https://hikewise-backend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// Session-konfiguration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

(async () => {
  try {
    console.log("Initializing MongoDB connection...");
    await connectDB();
    console.log("✅ MongoDB connected, starting server...");

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/trails", trailRoutes);
    app.use("/api/owned-gear", ownedGearRoutes);
    app.use("/api/packing-list", packingListRoutes);
    app.use("/api/weather", weatherRoutes);
    app.use("/api/maps", mapsRoutes);

    // Test-Route
    app.get("/api/hello", (req, res) => {
      res.json({ message: "Hello from the backend!" });
    });

    // Global error handling
    app.use((err, req, res, next) => {
      console.error("Global error:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize MongoDB connection:", error.message);
    process.exit(1);
  }
})();
