import express from "express";
import {
  createTrail,
  getUserTrails,
  getTrail,
  addPackingListItem,
  deletePackingListItem,
} from "../controllers/trailController.js";

const router = express.Router();

router.post("/", createTrail);
router.get("/user/:userId", getUserTrails);
router.get("/:id", getTrail);
router.post("/:id/packing-list", addPackingListItem);
router.delete("/:id/packing-list/:itemId", deletePackingListItem);

export default router;
