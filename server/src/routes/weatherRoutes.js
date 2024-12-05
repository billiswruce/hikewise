import express from "express";
import axios from "axios";

const router = express.Router();

// Get weather
router.get("/:lat/:lon", async (req, res) => {
  const { lat, lon } = req.params;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Fel vid hämtning av väderdata:", error.response.data);
    } else {
      console.error("Fel vid hämtning av väderdata:", error.message);
    }
    res.status(500).json({ message: "Kunde inte hämta väderdata" });
  }
});

export default router;
