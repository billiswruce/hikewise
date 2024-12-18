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
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hikewise.vercel.app",
      "https://hikewise-backend.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
let sessionArguments = {
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};
console.log(sessionArguments);
app.set("trust proxy", true);
app.use(session(sessionArguments));

// {"cookie":{"originalMaxAge":86400000,"expires":"2024-12-12T17:33:33.894Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"},"userId":"674894ed2a1c2f11727b05ef"}

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ message: "Välkommen till HikeWise API" });
});

(async () => {
  try {
    console.log("Initializing MongoDB connection...");
    await connectDB();
    console.log("✅ MongoDB connected, starting server...");
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/trails", trailRoutes);
    app.use("/api/owned-gear", ownedGearRoutes);
    app.use("/api/packing-list", packingListRoutes);
    app.use("/api/weather", weatherRoutes);
    app.use("/api/maps", mapsRoutes);
    app.get("/api/hello", (req, res) => {
      res.json({ message: "Hello from the backend!" });
    });
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
