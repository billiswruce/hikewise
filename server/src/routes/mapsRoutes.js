import axios from "axios";
import express from "express";

const router = express.Router();

// Geocoding API
// Översätt adresser till koordinater (lat, lng) eller tvärtom. Detta är användbart om du vill konvertera användarens input till data för klientens karta.
// Exempel på användning:
// En användare skriver in "Stockholm, Sverige".
// Servern skickar förfrågan till Google Maps Geocoding API och returnerar koordinaterna (59.3293, 18.0686).
router.get("/geocode", async (req, res) => {
  const address = req.query.address;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching geocode data", error });
  }
});

// Directions API
// Om du behöver generera rutter (vägbeskrivningar) mellan två punkter kan servern hantera detta och returnera data till klienten.
// Exempel på användning:
// Användaren väljer två punkter på klienten (start och slut).
// Servern skickar dessa till Google Maps Directions API för att generera en detaljerad rutt och returnerar den till klienten.
router.get("/directions", async (req, res) => {
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
});

export default router;

// Serverdelen:
// import { GoogleMap, Marker, Polyline, LoadScript } from "@react-google-maps/api";

// const MyMap = () => {
//   const mapStyles = { height: "500px", width: "100%" };
//   const center = { lat: 59.3293, lng: 18.0686 };

//   return (
//     <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//       <GoogleMap
//         mapContainerStyle={mapStyles}
//         center={center}
//         zoom={10}
//       >
//         {/* Lägg till markörer eller rutter */}
//         <Marker position={center} />
//       </GoogleMap>
//     </LoadScript>
//   );
// };
// export default MyMap;
