import express from "express";
const router = express.Router();

router.post("/register", (req, res) => {
  // TODO logik för användarregistrering
  res.send("User registered");
});

router.post("/login", (req, res) => {
  // TODO logik för användarinloggning
  res.send("User logged in");
});

export default router;
