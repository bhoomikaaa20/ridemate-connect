import mongoose, { Document, Schema, Types } from "mongoose";

export type RideStatus = "pending" | "accepted" | "completed" | "cancelled";

export interface IRide extends Document {
    pickup: string;
    drop_location: string;
    status: RideStatus;
    user_id: Types.ObjectId;
    rider_id: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const rideSchema = new Schema<IRide>(
    {
        pickup: {
            type: String,
            required: true,
            trim: true,
        },
        drop_location: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "completed", "cancelled"], // ✅ added cancelled
            default: "pending",
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rider_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IRide>("Ride", rideSchema);