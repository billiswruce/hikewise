import express from "express";
import { login, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", getMe);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
