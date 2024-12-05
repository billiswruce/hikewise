import express from "express";
import PackingList from "../models/PackingList.js";

const router = express.Router();

// Create packing list
router.post("/", async (req, res) => {
  const { trailId, items } = req.body;
  try {
    const packingList = new PackingList({ trailId, items });
    const savedPackingList = await packingList.save();
    res.status(201).json(savedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get packing list
router.get("/:trailId", async (req, res) => {
  try {
    const packingList = await PackingList.findOne({
      trailId: req.params.trailId,
    });
    if (!packingList)
      return res.status(404).json({ message: "Packing list not found" });
    res.status(200).json(packingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
