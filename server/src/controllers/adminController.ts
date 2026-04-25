import { Request, Response } from "express";
import User from "../models/User";
import Ride from "../models/Ride";

// 🔹 GET all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password"); // hide password
        res.json(users);
    } catch {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// 🔹 DELETE user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        // ✅ FIXED: correct field name
        await Ride.deleteMany({ user_id: id });

        res.json({ message: "User deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// 🔹 GET all rides
export const getRides = async (_req: Request, res: Response) => {
    try {
        const rides = await Ride.find()
            // ✅ FIXED: correct field names
            .populate("user_id", "name email")
            .populate("rider_id", "name email")
            .sort({ createdAt: -1 });

        res.json(rides);
    } catch {
        res.status(500).json({ message: "Error fetching rides" });
    }
};

// 🔹 DELETE ride
export const deleteRide = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await Ride.findByIdAndDelete(id);

        res.json({ message: "Ride deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting ride" });
    }
};