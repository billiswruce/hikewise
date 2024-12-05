import express from "express";
import axios from "axios";
import Trail from "../models/Trail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    name,
    location,
    latitude,
    longitude,
    length,
    difficulty,
    hikeDate,
    hikeEndDate,
    image,
    description,
    hiked,
    creatorId,
  } = req.body;

  const placeholderImage = "http://localhost:5173/assets/trailPlaceholder.webp";

  try {
    // Get weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const weatherData = weatherResponse.data;

    // Create new trail
    const newTrail = new Trail({
      name,
      location,
      latitude,
      longitude,
      length,
      difficulty,
      description,
      image: image || placeholderImage,
      hikeDate,
      hikeEndDate,
      creatorId,
      hiked,
      weather: {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      },
    });

    // Save trail in db
    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Trails for specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const trails = await Trail.find({ creatorId: req.params.userId });
    res.json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single trails
router.get("/:id", async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }
    res.json(trail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
