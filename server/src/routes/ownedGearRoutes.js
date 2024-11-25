import express from "express";
import OwnedGear from "../models/ownedGear.js";
import mongoose from "mongoose";

const router = express.Router();

// Endpoint to fetch gear and food items by userId
router.get("/api/owned-gear", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user authentication is handled (e.g., via JWT or session)

    // Fetch the owned gear for the specific user
    const userGear = await OwnedGear.findOne({ userId }).populate("userId"); // .populate('userId') if you want to include user details

    if (!userGear) {
      return res
        .status(404)
        .json({ message: "No gear found for the specified user." });
    }

    // Separate the items into two categories: Gear and Food
    const gearItems = userGear.items.filter((item) => item.type === "Gear");
    const foodItems = userGear.items.filter((item) => item.type === "Food");

    // Send back both categories
    res.json({
      gear: gearItems,
      food: foodItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching gear and food items" });
  }
});

export default router;
