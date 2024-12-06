import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/authRoutes.js";
import ownedGearRoutes from "./routes/ownedGearRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import PackingList from "./routes/packingListRoutes.js";
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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Add your existing routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/owned-gear", ownedGearRoutes);
// app.use("/api/packing-list", PackingList);
app.use("/api/weather", weatherRoutes);
app.use("/api/maps", mapsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`.rainbow.bold)
);
