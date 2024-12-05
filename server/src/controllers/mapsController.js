import axios from "axios";

export const getGeocode = async (req, res) => {
  const address = req.query.address;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching geocode data", error });
  }
};

export const getDirections = async (req, res) => {
  const { origin, destination } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching directions", error });
  }
};
