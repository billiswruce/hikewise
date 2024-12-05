import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Hämta användarens detaljer
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("ownedGear")
      .populate("favoriteTrails");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta användarens favoriter
router.get("/me/favorites", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId).populate("favoriteTrails");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favoriteTrails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till/ta bort favorit
router.post("/favorites/:trailId", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    const trailId = req.params.trailId;

    const index = user.favoriteTrails.indexOf(trailId);
    if (index > -1) {
      user.favoriteTrails.splice(index, 1);
    } else {
      user.favoriteTrails.push(trailId);
    }

    await user.save();
    res.status(200).json(user.favoriteTrails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/favorites/:trailId", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    const trailId = req.params.trailId;

    const index = user.favoriteTrails.indexOf(trailId);
    if (index > -1) {
      user.favoriteTrails.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Favorite removed" });
    } else {
      return res.status(404).json({ message: "Favorite not found" });
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/:userId/gear", async (req, res) => {
  const { name, quantity, condition, category } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.ownedGear.push({
      name,
      quantity,
      condition,
      category,
      packed: false,
    });
    await user.save();

    res
      .status(200)
      .json({ message: "Gear item added successfully", gear: user.ownedGear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
