import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Hämta användarens detaljer
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("ownedGear") // Om ownedGear är ett separat schema
      .populate("favoriteTrails");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till en favoritled
router.post("/:userId/favoriteTrails", async (req, res) => {
  const { trailId } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.favoriteTrails.includes(trailId)) {
      return res.status(400).json({ message: "Trail already in favorites" });
    }
    user.favoriteTrails.push(trailId);
    await user.save();
    res.status(200).json({ message: "Trail added to favorites" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ta bort en favoritled
router.delete("/:userId/favoriteTrails/:trailId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favoriteTrails = user.favoriteTrails.filter(
      (id) => id.toString() !== req.params.trailId
    );
    await user.save();
    res.status(200).json({ message: "Trail removed from favorites" });
  } catch (error) {
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
