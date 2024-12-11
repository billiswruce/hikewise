import User from "../models/User.js";

// Funktion för att logga in eller skapa en ny användare
export const login = async (req, res) => {
  const { auth0Id, email, name } = req.body;

  console.log("Inkommande data från frontend:", { auth0Id, email, name });

  try {
    // Kontrollera att auth0Id finns
    if (!auth0Id) {
      console.warn("auth0Id saknas i request body!");
      return res.status(400).json({ message: "auth0Id är obligatoriskt" });
    }

    // Hämta befintlig användare
    let user = await User.findOne({ auth0Id });

    if (user) {
      // Befintlig användare hittad, uppdatera email om den finns
      console.log("Befintlig användare hittad:", user);
      user.email = email || user.email;
      await user.save();

      req.session.userId = user._id;
      console.log("Session userId satt till:", req.session.userId);

      return req.session.save((err) => {
        if (err) {
          console.error("Fel vid session.save():", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        res.status(200).json({
          message: "Användare inloggad!",
          user,
        });
      });
    } else {
      // Skapa ny användare om ingen befintlig hittas
      console.log("Ingen användare hittades, skapar ny användare...");
      const uniqueUsername = name || `user_${Date.now()}`;
      user = await User.create({
        auth0Id,
        email: email || "",
        username: uniqueUsername,
        favoriteTrails: [],
        ownedGear: [],
      });

      req.session.userId = user._id;
      console.log("Ny användare skapad:", user);

      return req.session.save((err) => {
        if (err) {
          console.error("Fel vid session.save():", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        res.status(200).json({
          message: "Ny användare skapad och inloggad!",
          user,
        });
      });
    }
  } catch (error) {
    console.error("Fel vid inloggning:", error.message);
    res.status(500).json({
      message: "Fel vid inloggning",
      error: error.message,
    });
  }
};

// Funktion för att hämta nuvarande användare
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

// Funktion för att logga ut användaren
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
