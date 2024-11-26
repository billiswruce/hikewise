import express from "express";
import axios from "axios";
import Trail from "../models/Trail.js";

const router = express.Router();

// Skapa en ny trail
router.post("/", async (req, res) => {
  const {
    name,
    location,
    latitude,
    longitude,
    length,
    difficulty,
    hikeDate,
    image,
    description,
  } = req.body;

  try {
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
    const newTrail = new Trail({
      name,
      location,
      latitude,
      longitude,
      length,
      difficulty,
      description,
      image,
      hikeDate,
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

// Hämta trails med filtrering
router.get("/", async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = difficulty ? { difficulty } : {};
    const trails = await Trail.find(filter);
    res.status(200).json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
