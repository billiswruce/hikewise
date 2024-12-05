import express from "express";
import { getGeocode, getDirections } from "../controllers/mapsController.js";

const router = express.Router();

router.get("/geocode", getGeocode);
router.get("/directions", getDirections);

export default router;
