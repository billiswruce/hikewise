import express from "express";
import { login, getMe, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;
