import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { auth0Id, email, name } = req.body;
  console.log("Login attempt:", { auth0Id, email, name });

  try {
    if (!auth0Id) {
      console.log("Missing auth0Id in request");
      return res.status(400).json({ message: "auth0Id är obligatoriskt" });
    }

    let user = await User.findOne({ auth0Id });
    let isNewUser = false;

    if (user) {
      user.email = email || user.email;
      await user.save();
    } else {
      isNewUser = true;
      const uniqueUsername = name || `user_${Date.now()}`;
      user = await User.create({
        auth0Id,
        email: email || "",
        username: uniqueUsername,
        favoriteTrails: [],
        ownedGear: [],
      });
    }

    req.session.userId = user._id;

    return req.session.save((err) => {
      if (err) {
        console.error("Fel vid session.save():", err);
        return res.status(500).json({ message: "Failed to save session" });
      }
      res.status(200).json({
        message: isNewUser
          ? "Ny användare skapad och inloggad!"
          : "Användare inloggad!",
        user,
        sessionId: req.session.id,
        isNewUser,
      });
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error.message);
    res.status(500).json({
      message: "Fel vid inloggning",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  console.log("Kontrollerar aktiv session...");

  if (!req.session.userId) {
    console.warn("Ingen aktiv session hittad");
    return res.status(401).json({ message: "Ingen aktiv session" });
  }

  console.log("Session userId hittad:", req.session.userId);

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.warn(
        "Ingen användare hittades för session userId:",
        req.session.userId
      );
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    console.log("Användare hämtad från databasen:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error.message);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Fel vid session-destruktion:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    console.log("Session förstörd och cookie borttagen");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const refreshSession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Uppdatera session
    if (req.session) {
      req.session.touch();
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 timmar

      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }

    res.json({
      message: "Session refreshed",
      sessionStatus: {
        active: true,
        expiresIn: req.session?.cookie?.maxAge,
      },
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    res.status(500).json({ message: "Failed to refresh session" });
  }
};
