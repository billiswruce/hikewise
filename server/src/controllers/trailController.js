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
    packingList,
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
      packingList: packingList || {
        gear: [],
        food: [],
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

export const addPackingListItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isFood } = req.body;

    const trail = await Trail.findById(id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    const newItem = { name, isChecked: false };

    if (isFood) {
      trail.packingList.food.push(newItem);
    } else {
      trail.packingList.gear.push(newItem);
    }

    const updatedTrail = await trail.save();
    res.json(updatedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePackingListItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { isFood } = req.body;

    const trail = await Trail.findById(id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    const list = isFood ? trail.packingList.food : trail.packingList.gear;
    const updatedList = list.filter((item) => item._id.toString() !== itemId);

    if (isFood) {
      trail.packingList.food = updatedList;
    } else {
      trail.packingList.gear = updatedList;
    }

    const updatedTrail = await trail.save();
    res.status(200).json(updatedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
