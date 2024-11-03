import express from "express";
import RecommendedPackingList from "../models/RecommendedPackingList.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { trailId, items } = req.body;

  try {
    const newPackingList = new RecommendedPackingList({ trailId, items });
    const savedPackingList = await newPackingList.save();
    res.status(201).json(savedPackingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:trailId", async (req, res) => {
  try {
    const packingList = await RecommendedPackingList.findOne({
      trailId: req.params.trailId,
    });
    if (!packingList) {
      return res
        .status(404)
        .json({ message: "Recommended packing list not found" });
    }
    res.status(200).json(packingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
