import express from "express";
import {
  getUserDetails,
  getUserFavorites,
  toggleFavorite,
  addGear,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", isAuthenticated, getUserDetails);
router.get("/me/favorites", isAuthenticated, getUserFavorites);
router.post("/favorites/toggle/:trailId", isAuthenticated, toggleFavorite);
router.post("/:userId/gear", isAuthenticated, addGear);

export default router;
