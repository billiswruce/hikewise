import express from "express";
import axios from "axios"; // För att hämta väderdata från OpenWeatherMap
import Trail from "../models/Trail.js";

const router = express.Router();

// Skapa en ny rutt med väderdata
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
    // Hämta väderdata för angivna koordinater från OpenWeatherMap
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: process.env.OPENWEATHER_API_KEY, // API-nyckel för OpenWeatherMap
          units: "metric", // Enheter i Celsius
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
      description,
      image,
      weather: {
        temperature: weatherData.main.temp, // Temperatur i grader Celsius
        description: weatherData.weather[0].description, // Väderbeskrivning (t.ex. soligt)
        icon: weatherData.weather[0].icon, // Väderikon
      },
      hikeDate,
    });

    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta alla trails med möjlighet att filtrera på svårighetsgrad (difficulty)
router.get("/", async (req, res) => {
  try {
    const { difficulty } = req.query; // Läs in query-parametern för filtrering

    let filter = {};
    if (difficulty) {
      // Om det finns en "difficulty"-parameter, filtrera baserat på svårighetsgrad
      filter.difficulty = difficulty;
    }

    const trails = await Trail.find(filter); // Hämta trails som matchar filtreringen

    res.status(200).json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hämta en specifik trail
router.get("/:trailId", async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.trailId);

    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    res.status(200).json(trail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
