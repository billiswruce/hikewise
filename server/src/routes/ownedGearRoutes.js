import express from "express";
import {
  getOwnedGear,
  addGearItem,
  updateGearItem,
  deleteGearItem,
  getGearByType,
} from "../controllers/ownedGearController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all gear items
router.get("/", isAuthenticated, getOwnedGear);

// Add new gear item
router.post("/", isAuthenticated, addGearItem);

// Update specific gear item
router.put("/:itemId", isAuthenticated, updateGearItem);

// Delete specific gear item
router.delete("/:itemId", isAuthenticated, deleteGearItem);

// Get gear items by type
router.get("/filter", isAuthenticated, getGearByType);

export default router;
