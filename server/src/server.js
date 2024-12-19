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

app.set("trust proxy", 1);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://hikewise.vercel.app"]
    : ["http://localhost:5173", "http://localhost:3000"];

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60,
    autoRemove: "native",
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  },
  name: "sessionId",
};

app.use(session(sessionConfig));

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request origin:", origin);

      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Origin not allowed:", origin);
        return callback(new Error("CORS policy violation"), false);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, Cookie"
  );
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers);
  next();
});

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
