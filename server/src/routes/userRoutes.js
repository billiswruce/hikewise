import express from "express";
import {
  getUserDetails,
  getUserFavorites,
  toggleFavorite,
  addGear,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getUserDetails);
router.get("/me/favorites", getUserFavorites);
router.post("/favorites/:trailId", toggleFavorite);
router.post("/:userId/gear", addGear);

export default router;
