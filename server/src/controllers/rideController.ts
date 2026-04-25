import { Request, Response } from "express";
import Ride from "../models/Ride";

// 🔹 Get pending rides
export const getAvailableRides = async (_req: Request, res: Response) => {
    const rides = await Ride.find({ status: "pending" }).sort({ createdAt: 1 });
    res.json(rides);
};

// 🔹 Get rider rides
export const getMyRides = async (req: any, res: Response) => {
    const rides = await Ride.find({ rider_id: req.user._id }).sort({ createdAt: -1 });
    res.json(rides);
};

// 🔹 Accept ride
export const acceptRide = async (req: any, res: Response) => {
    const ride = await Ride.findOneAndUpdate(
        { _id: req.params.id, status: "pending" },
        {
            status: "accepted",
            rider_id: req.user._id,
        },
        { new: true }
    );

    if (!ride) return res.status(400).json({ message: "Ride not available" });

    res.json(ride);
};

// 🔹 Complete ride
export const completeRide = async (req: Request, res: Response) => {
    const ride = await Ride.findByIdAndUpdate(
        req.params.id,
        { status: "completed" },
        { new: true }
    );

    res.json(ride);
};

// 🔹 Create ride (User books)
export const createRide = async (req: any, res: any) => {
    try {
        const { pickup, drop_location } = req.body;

        const ride = await Ride.create({
            pickup,
            drop_location,
            user_id: req.user._id,
        });

        res.json(ride);
    } catch {
        res.status(500).json({ message: "Error booking ride" });
    }
};

// 🔹 Get user rides
export const getUserRides = async (req: any, res: any) => {
    const rides = await Ride.find({ user_id: req.user._id }).sort({
        createdAt: -1,
    });

    res.json(rides);
};

// 🔹 Cancel ride
export const cancelRide = async (req: any, res: any) => {
    const ride = await Ride.findByIdAndUpdate(
        req.params.id,
        { status: "cancelled" },
        { new: true }
    );

    res.json(ride);
};