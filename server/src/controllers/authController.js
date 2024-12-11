import User from "../models/User.js";
// import { generateUniqueUsername } from "../utils/userUtils.js";

export const login = async (req, res) => {
  const { auth0Id, email, name } = req.body;

  console.log("Inkommande data från frontend:", { auth0Id, email, name });
  console.log("Request body:", req.body);

  try {
    if (!auth0Id) {
      console.warn("auth0Id saknas i request body!");
      return res.status(400).json({ message: "auth0Id är obligatoriskt" });
    }

    let existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      existingUser.email = email || existingUser.email;
      await existingUser.save();

      req.session.userId = existingUser._id;
      console.log("Session userId satt till:", req.session.userId);
      return res.status(200).json({
        message: "Användare inloggad!",
        user: existingUser,
      });
    }

    // Skapa ny användare
    const uniqueUsername = await generateUniqueUsername(name || "user");
    const newUser = await User.create({
      auth0Id,
      email: email || "",
      username: uniqueUsername,
    });

    req.session.userId = newUser._id; // Flyttad här
    console.log("Ny användare skapad:", newUser);
    console.log("Session userId satt till:", req.session.userId);
    res.status(200).json({
      message: "Ny användare skapad och inloggad!",
      user: newUser,
    });
  } catch (error) {
    console.error("Detaljerat fel vid inloggning:", error.message);
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
