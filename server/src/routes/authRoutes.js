import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // Google OAuth routes
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.status(200).json({ message: "Logged in successfully", user: req.user });
//   }
// );

// // GitHub OAuth routes
// router.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.status(200).json({ message: "Logged in successfully", user: req.user });
//   }
// );

export default router;
