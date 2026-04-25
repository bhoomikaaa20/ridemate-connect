import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role,
        });

        const token = generateToken(user._id.toString(), user.role);

        res.cookie("token", token, { httpOnly: true });

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Signup failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = generateToken(user._id.toString(), user.role);

        res.cookie("token", token, { httpOnly: true });

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
        });
    } catch {
        res.status(500).json({ message: "Login failed" });
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};

export const getMe = async (req: any, res: Response) => {
    res.json(req.user);
};
export const seedAdmin = async (_req: any, res: any) => {
    try {
        const existing = await User.findOne({ email: "admin@ride.app" });

        if (existing) {
            return res.json({ message: "Admin already exists" });
        }

        const hashed = await bcrypt.hash("Admin123!", 10);

        const admin = await User.create({
            name: "Admin",
            email: "admin@ride.app",
            password: hashed,
            role: "admin",
        });

        res.json({ message: "Admin created", admin });
    } catch {
        res.status(500).json({ message: "Error seeding admin" });
    }
};