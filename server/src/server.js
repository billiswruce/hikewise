import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Test from "./models/Test.js";
import packingListRoutes from "./routes/packingListRoutes.js";
import trailRoutes from "./routes/trailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendedPackingList from "./routes/recommendedPackingListRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js"; // Korrigerad import
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Importera din Passport-konfiguration

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware för att parsa JSON och hantera CORS
app.use(express.json());
app.use(cors());

// Lägg till session och passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api/packing-list", packingListRoutes);
app.use("/api/recommended-packing-list", recommendedPackingList);
app.use("/api/weather", weatherRoutes);
app.use("/api/maps", mapsRoutes); // Korrigerad route

// Testroute för att skapa en post
app.post("/api/test", async (req, res) => {
  try {
    const newTest = new Test({ name: req.body.name });
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route för att hämta alla poster
app.get("/api/test", async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Starta servern
app.listen(PORT, () => console.log("Server is blooming".rainbow.bold));
