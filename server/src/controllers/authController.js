import User from "../models/User.js";
// import { generateUniqueUsername } from "../utils/userUtils.js";

export const login = async (req, res) => {
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
    console.error("Fel vid hämtning av användare:", error);
    res.status(500).json({ message: "Något gick fel" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};
