import express from "express";
import { signup, login, logout, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { seedAdmin } from "../controllers/authController";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/seed-admin", seedAdmin);


export default router;