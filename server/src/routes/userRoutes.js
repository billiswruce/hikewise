import express from "express";
import User from "../models/User.js";
import Trail from "../models/Trail.js";

const router = express.Router();

// Hämta alla användare
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta en specifik användares detaljer, inklusive favoriter och vänner
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("favorites", "name location") // Hämta favoritvandringsleders information
      .populate("friends", "username email"); // Hämta vännernas information (namn och email)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till en ny favorit till en användare
router.post("/:userId/favorites", async (req, res) => {
  const { trailId } = req.body; // ID för den vandringsled som ska läggas till som favorit

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kontrollera om favoriten redan finns
    if (user.favorites.includes(trailId)) {
      return res.status(400).json({ message: "Trail is already a favorite" });
    }

    // Lägg till favoriten och spara
    user.favorites.push(trailId);
    await user.save();

    res.status(200).json({ message: "Favorite added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till en vän till en användare
router.post("/:userId/friends", async (req, res) => {
  const { friendId } = req.body; // ID för den användare som ska läggas till som vän

  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Kontrollera om vännen redan finns
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    // Lägg till vännen och spara
    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:userId/favorites
router.post("/:userId/favorites", async (req, res) => {
  const { trailId } = req.body;

  try {
    // Hitta användaren
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kontrollera om vandringsleden finns
    const trail = await Trail.findById(trailId);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    // Kontrollera om leden redan är en favorit
    if (user.favorites.includes(trailId)) {
      return res.status(400).json({ message: "Trail is already a favorite" });
    }

    // Lägg till favoriten och spara
    user.favorites.push(trailId);
    await user.save();

    res.status(200).json({ message: "Favorite added successfully", trail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
