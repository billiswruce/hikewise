import express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Auth0-konfiguration
const AUTH0_DOMAIN =
  process.env.AUTH0_DOMAIN || "dev-xd3jckbyc4yzmut8.us.auth0.com";
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || "YOUR_API_IDENTIFIER";

// JWT-konfiguration för att verifiera token
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// Funktion för att verifiera en JWT-token
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

// Middleware för att verifiera Auth0-token
const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Ingen token tillhandahållen" });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("Tokenvalidering misslyckades:", err);
        return res.status(401).json({ message: "Ogiltig token" });
      }
      req.user = decoded; // Lagra användarinfo från token i request-objektet
      next();
    }
  );
};

// Route för att hantera inloggning och spara användaren i databasen
router.post("/login", async (req, res) => {
  const { auth0Id, email, name } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { auth0Id },
      {
        email,
        username: name,
        auth0Id,
      },
      { upsert: true, new: true }
    );

    req.session.userId = user._id;

    res.status(200).json({
      message: "Användare lagrad och inloggad!",
      user,
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    res.status(500).json({ message: "Fel vid inloggning" });
  }
});

// Route för att hämta information om den inloggade användaren
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

export default router;
