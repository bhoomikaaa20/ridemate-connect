import express from "express";
import {
    getUsers,
    deleteUser,
    getRides,
    deleteRide
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Optional: add admin check later
router.get("/users", protect, getUsers);
router.delete("/users/:id", protect, deleteUser);

router.get("/rides", protect, getRides);
router.delete("/rides/:id", protect, deleteRide);

export default router;