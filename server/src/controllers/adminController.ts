import { Request, Response } from "express";
import User from "../models/User";
import Ride from "../models/Ride";

// GET all users
export const getUsers = async (_req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    await Ride.deleteMany({ user: id });

    res.json({ message: "User deleted" });
};

// GET all rides
export const getRides = async (_req: Request, res: Response) => {
    const rides = await Ride.find()
        .populate("user", "name email")
        .populate("rider", "name email")
        .sort({ createdAt: -1 });

    res.json(rides);
};

// DELETE ride
export const deleteRide = async (req: Request, res: Response) => {
    const { id } = req.params;

    await Ride.findByIdAndDelete(id);

    res.json({ message: "Ride deleted" });
};