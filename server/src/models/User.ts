import mongoose from "mongoose";

export type Role = "user" | "rider" | "admin";

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: Role;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "rider", "admin"], default: "user" }
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);