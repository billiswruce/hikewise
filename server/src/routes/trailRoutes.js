import express from "express";
import {
  createTrail,
  getUserTrails,
  getTrail,
  addPackingListItem,
  deletePackingListItem,
  updatePackingListItem,
} from "../controllers/trailController.js";

const router = express.Router();

router.post("/", createTrail);
router.get("/user/:userId", getUserTrails);
router.get("/:id", getTrail);
router.post("/:id/packing-list", addPackingListItem);
router.delete("/:id/packing-list/:itemId", deletePackingListItem);
router.patch("/:id/packing-list/:itemId", updatePackingListItem);
export default router;
