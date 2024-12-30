import express from "express";
import {
  login,
  getMe,
  logout,
  // refreshSession,
  checkSession,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.get("/check-session", checkSession);
// router.post("/refresh-session", refreshSession);

export default router;
