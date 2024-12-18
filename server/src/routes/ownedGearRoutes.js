import express from "express";
import {
  getOwnedGear,
  addGearItem,
  updateGearItem,
  deleteGearItem,
  getGearByType,
  getGearByCategory,
} from "../controllers/ownedGearController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getOwnedGear);
router.get("/filter", isAuthenticated, getGearByType);
router.get("/filter-by-category", isAuthenticated, getGearByCategory);
router.post("/", isAuthenticated, addGearItem);
router.put("/:itemId", isAuthenticated, updateGearItem);
router.delete("/:itemId", isAuthenticated, deleteGearItem);

export default router;
