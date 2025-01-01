import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  createTrail,
  getUserTrails,
  getTrail,
  updateTrail,
  deleteTrail,
  addPackingListItem,
  deletePackingListItem,
  updatePackingListItem,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/trailController.js";

const router = express.Router();

router.post("/", isAuthenticated, createTrail);
router.get("/user/:userId", isAuthenticated, getUserTrails);
router.get("/:id", isAuthenticated, getTrail);
router.post("/:id/packing-list", isAuthenticated, addPackingListItem);
router.delete(
  "/:id/packing-list/:itemId",
  isAuthenticated,
  deletePackingListItem
);
router.put("/:id/packing-list/:itemId", isAuthenticated, updatePackingListItem);
router.post("/:id/comments", isAuthenticated, addComment);
router.patch("/:id/comments/:commentId", isAuthenticated, updateComment);
router.delete("/:id/comments/:commentId", isAuthenticated, deleteComment);
router.put("/:id", isAuthenticated, updateTrail);
router.delete("/:id", isAuthenticated, deleteTrail);

export default router;
