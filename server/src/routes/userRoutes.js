import express from "express";
import User from "../models/User.js";
import Trail from "../models/Trail.js"; // Om Trail inte används längre, kan den tas bort

const router = express.Router();

// Hämta användardetaljer, inklusive packlistor och utrustning (utan community-delen)
router.get("/:userId", async (req, res) => {
  try {
    // Hämta användarens detaljer, packlista och utrustning (ownedGear)
    const user = await User.findById(req.params.userId)
      .populate({
        path: "packingList", // Om du har en packingList-collection
        populate: {
          path: "items",
          select: "name quantity packed condition", // Vilka fält du vill visa för varje packlistobjekt
        },
      })
      .populate({
        path: "ownedGear", // Om du har en ownedGear-collection (utrustning)
        select: "items name quantity packed condition", // Fälten att visa
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Returnera användarens data, inklusive packlistor och utrustning
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till ett objekt till användarens packlista
router.post("/:userId/packingList", async (req, res) => {
  const { name, quantity, condition } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lägg till objektet till packlistan
    user.packingList.items.push({
      name,
      quantity,
      condition,
      packed: false, // Standardvärde
    });
    await user.save();

    res
      .status(200)
      .json({ message: "Item added to packing list successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till ett objekt till användarens utrustningslista (ownedGear)
router.post("/:userId/gear", async (req, res) => {
  const { name, quantity, condition } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lägg till utrustning till användarens utrustningslista
    user.ownedGear.items.push({
      name,
      quantity,
      condition,
      packed: false, // Standardvärde
    });
    await user.save();

    res.status(200).json({ message: "Gear item added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera statusen för ett packat objekt (t.ex. utrustning eller packlista)
router.put("/:userId/packingList/:itemId", async (req, res) => {
  const { packed } = req.body; // packed true/false för att markera om objektet är packat

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.packingList.items.id(req.params.itemId);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found in packing list" });
    }

    // Uppdatera packad-status för objektet
    item.packed = packed;
    await user.save();

    res.status(200).json({ message: "Packing list item status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera statusen för ett packat objekt (utrustning)
router.put("/:userId/gear/:itemId", async (req, res) => {
  const { packed } = req.body; // packed true/false för att markera om objektet är packat

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.ownedGear.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in gear list" });
    }

    // Uppdatera packad-status för objektet
    item.packed = packed;
    await user.save();

    res.status(200).json({ message: "Gear item status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
