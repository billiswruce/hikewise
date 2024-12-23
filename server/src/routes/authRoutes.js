import express from "express";
import { login, getMe, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.get("/check-session", (req, res) => {
  console.log("Session check:", {
    sessionExists: !!req.session,
    userId: req.session?.userId,
    cookie: req.session?.cookie,
  });
  res.json({
    sessionActive: !!req.session?.userId,
    sessionId: req.session?.id,
  });
});

export default router;
