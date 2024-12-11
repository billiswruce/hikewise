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

router.get("/", isAuthenticated, getOwnedGear);
router.post("/", isAuthenticated, addGearItem);
router.put("/:itemId", isAuthenticated, updateGearItem);
router.delete("/:itemId", isAuthenticated, deleteGearItem);
router.get("/filter", isAuthenticated, getGearByType);
export default router;
