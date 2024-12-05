import express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Auth0-config
const AUTH0_DOMAIN =
  process.env.AUTH0_DOMAIN || "dev-xd3jckbyc4yzmut8.us.auth0.com";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "YOUR_API_IDENTIFIER";

// JWT-config for verifying token
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// Verifying JWT token
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });

async function generateUniqueUsername(baseName) {
  let username = baseName;
  let counter = 1;

  while (true) {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return username;
    }
    username = `${baseName}${counter}`;
    counter++;
  }
}

// Login
router.post("/login", async (req, res) => {
  const { auth0Id, email, name } = req.body;

  console.log("Inkommande data från frontend:", { auth0Id, email, name });

  try {
    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id är obligatoriskt" });
    }

    let existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      existingUser.email = email || existingUser.email;
      await existingUser.save();

      req.session.userId = existingUser._id;
      return res.status(200).json({
        message: "Användare inloggad!",
        user: existingUser,
      });
    }

    const uniqueUsername = await generateUniqueUsername(name || "user");

    const newUser = await User.create({
      auth0Id,
      email: email || "",
      username: uniqueUsername,
    });

    req.session.userId = newUser._id;

    res.status(200).json({
      message: "Ny användare skapad och inloggad!",
      user: newUser,
    });
  } catch (error) {
    console.error("Detaljerat fel vid inloggning:", error);
    res.status(500).json({
      message: "Fel vid inloggning",
      error: error.message,
    });
  }
});

// Get user
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Ingen aktiv session" });
  }

  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    res.status(500).json({ message: "Något gick fel" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
