import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { auth0Id, email, name } = req.body;

  try {
    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id är obligatoriskt" });
    }

    let user = await User.findOne({ auth0Id });
    let isNewUser = false;

    if (user) {
      user.email = email || user.email;
      await user.save();
    } else {
      isNewUser = true;
      let baseUsername = name || email.split("@")[0];
      let uniqueUsername = baseUsername;

      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;
        counter++;
        if (counter > 10) {
          uniqueUsername = `user_${Date.now()}`;
          break;
        }
      }

      user = await User.create({
        auth0Id,
        email: email || "",
        username: uniqueUsername,
        favoriteTrails: [],
        ownedGear: [],
      });
    }

    req.session.userId = user._id;
    req.session.auth0Id = auth0Id;

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          reject(err);
          return;
        }
        resolve();
      });
    });

    res.json({
      message: isNewUser
        ? "Ny användare skapad och inloggad!"
        : "Användare inloggad!",
      user,
      sessionId: req.session.id,
      isNewUser,
    });
  } catch (error) {
    console.error(`Login error for auth0Id ${auth0Id}:`, error);
    res
      .status(500)
      .json({ message: "Fel vid inloggning", error: error.message });
  }
};

export const getMe = async (req, res) => {
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
    console.error(`Error fetching user ${req.session.userId}:`, error);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const checkSession = async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.json({
        sessionActive: false,
        message: "No active session",
        debug: { sessionId: req.session?.id },
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.json({
        sessionActive: false,
        message: "User not found",
        debug: { userId: req.session.userId },
      });
    }

    req.session.touch();
    await new Promise((resolve) => req.session.save(resolve));

    res.json({
      sessionActive: true,
      sessionId: req.session.id,
      userId: req.session.userId,
    });
  } catch (error) {
    console.error(
      `Session check error for user ${req.session?.userId}:`,
      error
    );
    res.status(500).json({
      sessionActive: false,
      error: error.message,
      debug: { sessionId: req.session?.id },
    });
  }
};
