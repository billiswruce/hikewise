import express from "express";
import { login, getMe, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.get("/check-session", (req, res) => {
    console.log("Session content:", req.session);
    res.json({ session: req.session });
  });
  

export default router;
