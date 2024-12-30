import axios from "axios";

export const getWeather = async (req, res) => {
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
      console.error("Error fetching weather data:", error.response.data);
    } else {
      console.error("Error fetching weather data:", error.message);
    }
    res.status(500).json({ message: "Could not fetch weather data" });
  }
};
