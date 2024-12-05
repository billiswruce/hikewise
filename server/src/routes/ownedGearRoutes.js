import express from "express";
import {
  getOwnedGear,
  addGearItem,
  updateGearItem,
  deleteGearItem,
} from "../controllers/ownedGearController.js";

const router = express.Router();

router.get("/", getOwnedGear);
router.post("/", addGearItem);
router.put("/:itemId", updateGearItem);
router.delete("/:itemId", deleteGearItem);

export default router;
