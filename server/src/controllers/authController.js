import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { auth0Id, email, name } = req.body;
  console.log("\n=== Login Attempt ===");
  console.log("User:", { auth0Id, email, name });
  console.log("Session before:", {
    id: req.session?.id,
    isNew: req.session?.isNew,
  });
  console.log("Connect sid:", req.cookies["connect.sid"]);

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
      let baseUsername = name || email.split("@")[0];
      let uniqueUsername = baseUsername;

      // Kontrollera om användarnamnet redan finns och lägg till ett slumpmässigt nummer om det behövs
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;
        counter++;
        if (counter > 10) {
          // Fallback om vi inte hittar ett unikt namn efter 10 försök
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
    console.log("isNewUser", isNewUser);

    // Set session data
    req.session.userId = user._id;
    req.session.auth0Id = auth0Id;

    // Save session
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Session save failed:", err);
          reject(err);
          return;
        }
        console.log("Session after login:", {
          id: req.session.id,
          userId: req.session.userId,
          cookie: {
            maxAge: req.session.cookie.maxAge,
            expires: req.session.cookie.expires,
          },
        });
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
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Fel vid inloggning", error: error.message });
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

// Check if the user is logged in
export const checkSession = async (req, res) => {
  console.log("\n=== Check Session ===");
  console.log("Current session:", {
    id: req.session?.id,
    userId: req.session?.userId,
    cookie: req.session?.cookie,
  });

  console.log("Connect sid:", req.cookies["connect.sid"]);

  try {
    if (!req.session?.userId) {
      console.log("No active session found");
      return res.json({
        sessionActive: false,
        message: "No active session",
        debug: { sessionId: req.session?.id },
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      console.log("User not found for session");
      return res.json({
        sessionActive: false,
        message: "User not found",
        debug: { userId: req.session.userId },
      });
    }

    // Touch session without changing ID
    req.session.touch();
    await new Promise((resolve) => req.session.save(resolve));

    console.log("Session verified:", {
      id: req.session.id,
      userId: req.session.userId,
    });

    res.json({
      sessionActive: true,
      sessionId: req.session.id,
      userId: req.session.userId,
    });
  } catch (error) {
    console.error("Session check error:", error);
    res.status(500).json({
      sessionActive: false,
      error: error.message,
      debug: { sessionId: req.session?.id },
    });
  }
};
