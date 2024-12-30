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
  "https://hikewise.vercel.app",
  "https://hikewise-backend.vercel.app",
].filter(Boolean);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  rolling: true,
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

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  express.static("public", {
    maxAge: "1y",
    setHeaders: (res, path) => {
      if (path.endsWith(".webp")) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
    },
  })
);

app.use((req, res, next) => {
  console.log("\n=== Detailed Request Debug ===");
  console.log("Method & Path:", req.method, req.path);
  console.log("Headers:", {
    origin: req.headers.origin,
    cookie: req.cookies,
    "user-agent": req.headers["user-agent"],
  });
  console.log("Session Details:", {
    id: req.session?.id,
    userId: req.session?.userId,
    cookie: req.session?.cookie,
  });
  console.log("Cookies:", req.cookies);
  console.log("=========================\n");
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
