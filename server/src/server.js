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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://hikewise.vercel.app",
  "https://hikewise-backend.vercel.app",
];

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
    touchAfter: 24 * 3600,
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
  name: "connect.sid",
};

app.use(session(sessionConfig));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("=== Request Debug ===");
  console.log("Session ID:", req.session?.id);
  console.log("User ID:", req.session?.userId);
  console.log("Cookies:", req.cookies);
  console.log("Headers:", {
    origin: req.headers.origin,
    cookie: req.headers.cookie,
  });
  next();
});

app.use((req, res, next) => {
  console.log("=== Request Start ===");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Origin:", req.headers.origin);
  console.log("Session:", !!req.session);
  next();
});

app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    auth: !!req.session?.userId,
  });
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Välkommen till HikeWise API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/owned-gear", ownedGearRoutes);
app.use("/api/packing-list", packingListRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/maps", mapsRoutes);

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
