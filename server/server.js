import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import trailRoutes from "./src/routes/trailRoutes.js";
import ownedGearRoutes from "./src/routes/ownedGearRoutes.js";
import packingListRoutes from "./src/routes/packingListRoutes.js";
import weatherRoutes from "./src/routes/weatherRoutes.js";
import mapsRoutes from "./src/routes/mapsRoutes.js";
import NodeCache from "node-cache";

dotenv.config();
connectDB().then(() => console.log("Database connected successfully."));
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hikewise.vercel.app",
      "https://hikewise-backend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      touchAfter: 24 * 3600,
      stringify: false,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const cache = new NodeCache({ stdTTL: 600 }); // 10 minuters cache

// Test-Route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/owned-gear", ownedGearRoutes);
app.use("/api/packing-list", packingListRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/maps", mapsRoutes);

// // Lägg till en catch-all route i slutet av dina routes
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: "Route not found",
//     availableRoutes: [
//       "/api/auth",
//       "/api/users",
//       "/api/trails",
//       "/api/owned-gear",
//       "/api/packing-list",
//       "/api/weather",
//       "/api/maps",
//     ],
//   });
// });

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Lägg till pre-flight OPTIONS-hantering
app.options("*", cors());

export default app;
