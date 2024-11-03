import express from "express";
import Trail from "../models/Trail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newTrail = new Trail(req.body);
    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const trails = await Trail.find();
    res.status(200).json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:trailId", async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.trailId).populate({
      path: "recommendedPackingList",
      populate: {
        path: "items",
        select: "name quantity",
      },
    });

    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    res.status(200).json(trail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
