import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = async (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await User.findById(decoded.id).select("-password");
        req.user = user;

        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};