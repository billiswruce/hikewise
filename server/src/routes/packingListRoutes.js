import express from "express";
import {
  createPackingList,
  getPackingList,
} from "../controllers/packingListController.js";

const router = express.Router();

router.post("/", createPackingList);
router.get("/:trailId", getPackingList);

export default router;
