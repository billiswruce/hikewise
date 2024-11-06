import express from "express";
import axios from "axios"; // För att hämta väderdata från OpenWeatherMap
import Trail from "../models/Trail.js";

const router = express.Router();

// Skapa en ny rutt med väderdata
router.post("/", async (req, res) => {
  const { name, location, latitude, longitude, length, difficulty } = req.body;

  try {
    // Hämta väderdata för angivna koordinater
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

    // Skapa och spara en ny rutt i databasen
    const newTrail = new Trail({
      name,
      location,
      latitude,
      longitude,
      difficulty,
      length,
      weather: {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      },
    });

    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta alla rutter
router.get("/", async (req, res) => {
  try {
    const trails = await Trail.find();
    res.status(200).json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta en specifik rutt
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
