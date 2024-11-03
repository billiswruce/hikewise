import express from "express";
import PackingList from "@models/PackingList.js";

const router = express.Router();

// Skapa en ny packlista för en användare
router.post("/", async (req, res) => {
  const { userId, items } = req.body;

  try {
    const newPackingList = new PackingList({ userId, items });
    const savedPackingList = await newPackingList.save();
    res.status(201).json(savedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta en användares packlista
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const packingList = await PackingList.findOne({ userId });
    if (!packingList) {
      return res.status(404).json({ message: "Packing list not found" });
    }
    res.status(200).json(packingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lägg till ett objekt i en befintlig packlista
router.post("/:userId/item", async (req, res) => {
  const { userId } = req.params;
  const { name, quantity } = req.body;

  try {
    const packingList = await PackingList.findOne({ userId });
    if (!packingList) {
      return res.status(404).json({ message: "Packing list not found" });
    }

    packingList.items.push({ name, quantity, packed: false });
    const updatedPackingList = await packingList.save();
    res.status(200).json(updatedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera statusen för ett objekt (packat/ej packat)
router.patch("/:userId/item/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  const { packed } = req.body;

  try {
    const packingList = await PackingList.findOne({ userId });
    if (!packingList) {
      return res.status(404).json({ message: "Packing list not found" });
    }

    const item = packingList.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.packed = packed;
    const updatedPackingList = await packingList.save();
    res.status(200).json(updatedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
