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

router.use((req, res, next) => {
  console.log('Trail Route:', {
    method: req.method,
    path: req.path,
    params: req.params,
    auth: !!req.user
  });
  next();
});

router.post("/", isAuthenticated, createTrail);
router.get("/user/:userId", getUserTrails);
router.get("/:id", getTrail);
router.post("/:id/packing-list", addPackingListItem);
router.delete("/:id/packing-list/:itemId", deletePackingListItem);
router.patch("/:id/packing-list/:itemId", updatePackingListItem);
router.post("/:id/comments", addComment);
router.patch("/:id/comments/:commentId", updateComment);
router.delete("/:id/comments/:commentId", deleteComment);
router.put("/:id", isAuthenticated, updateTrail);
router.delete("/:id", isAuthenticated, deleteTrail);
export default router;
