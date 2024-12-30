import Trail from "../models/Trail.js";
import axios from "axios";
import mongoose from "mongoose";

// Create trail
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

  const placeholderImage = `${process.env.FRONTEND_URL}/trailPlaceholder.webp`;

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
    console.error("Error creating trail:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get trails
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

// Update trail
export const updateTrail = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.latitude && updates.longitude) {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: updates.latitude,
            lon: updates.longitude,
            appid: process.env.OPENWEATHER_API_KEY,
            units: "metric",
          },
        }
      );

      updates.weather = {
        temperature: weatherResponse.data.main.temp,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
      };
    }

    const updatedTrail = await Trail.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedTrail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    res.status(200).json(updatedTrail);
  } catch (error) {
    console.error("Error updating trail:", error);
    res.status(500).json({
      message: "Error updating trail",
      error: error.message,
    });
  }
};

// Delete trail
export const deleteTrail = async (req, res) => {
  try {
    console.log("=== Delete Trail Start ===");
    const { id } = req.params;

    const trail = await Trail.findById(id);
    if (!trail) {
      console.log("Trail not found:", id);
      return res.status(404).json({ message: "Trail not found" });
    }

    console.log("Authorization Check:", {
      trailCreatorId: trail.creatorId,
      userAuth0Id: req.user?.auth0Id,
      matches: trail.creatorId === req.user?.auth0Id,
      exactComparison: {
        length: {
          creator: trail.creatorId.length,
          user: req.user?.auth0Id?.length,
        },
        type: {
          creator: typeof trail.creatorId,
          user: typeof req.user?.auth0Id,
        },
      },
    });

    if (!req.user?.auth0Id) {
      console.log("No auth0Id in request");
      return res.status(401).json({ message: "Authentication required" });
    }

    if (trail.creatorId !== req.user.auth0Id) {
      console.log("Authorization mismatch");
      return res
        .status(403)
        .json({ message: "Not authorized to delete this trail" });
    }

    await Trail.findByIdAndDelete(id);
    console.log("Trail deleted successfully");

    res.status(200).json({ message: "Trail deleted successfully" });
  } catch (error) {
    console.error("Delete trail error:", error);
    res.status(500).json({ message: "Error deleting trail" });
  }
};

// Add packing list item
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

// Delete packing list item
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

// Update packing list item
export const updatePackingListItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { isFood, isChecked } = req.body;

    const trail = await Trail.findById(id);
    if (!trail) return res.status(404).json({ message: "Trail not found" });

    const list = isFood ? trail.packingList.food : trail.packingList.gear;
    const item = list.find((item) => item._id.toString() === itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.isChecked = isChecked;

    const updatedTrail = await trail.save();
    res.status(200).json(updatedTrail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const trail = await Trail.findById(id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }
    const newComment = { text, createdAt: new Date() };
    trail.comments.push(newComment);

    const updatedTrail = await trail.save();
    res.status(201).json(updatedTrail);
  } catch (error) {
    console.error("Error in addComment:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const trail = await Trail.findById(id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    const comment = trail.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.text = text;
    const updatedTrail = await trail.save();
    res.status(200).json(updatedTrail);
  } catch (error) {
    console.error("Error in updateComment:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const trail = await Trail.findById(id);
    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    trail.comments = trail.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    const updatedTrail = await trail.save();
    res.status(200).json(updatedTrail);
  } catch (error) {
    console.error("Error in deleteComment:", error.message);
    res.status(500).json({ message: error.message });
  }
};
