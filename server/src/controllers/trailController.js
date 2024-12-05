import Trail from "../models/Trail.js";
import axios from "axios";

export const createTrail = async (req, res) => {
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

    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUserTrails = async (req, res) => {
  try {
    const trails = await Trail.find({ creatorId: req.params.userId });
    res.json(trails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrail = async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }
    res.json(trail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
