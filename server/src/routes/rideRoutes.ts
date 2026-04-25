import express from "express";
import {
    getAvailableRides,
    getMyRides,
    acceptRide,
    completeRide, createRide, getUserRides, cancelRide
} from "../controllers/rideController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// USER
router.post("/", protect, createRide);
router.get("/user", protect, getUserRides);
router.put("/cancel/:id", protect, cancelRide);

// RIDER
router.get("/available", protect, getAvailableRides);
router.get("/my", protect, getMyRides);
router.put("/accept/:id", protect, acceptRide);
router.put("/complete/:id", protect, completeRide);

export default router;


