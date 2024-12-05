import express from "express";
import {
  createTrail,
  getUserTrails,
  getTrail,
} from "../controllers/trailController.js";

const router = express.Router();

router.post("/", createTrail);
router.get("/user/:userId", getUserTrails);
router.get("/:id", getTrail);

export default router;
