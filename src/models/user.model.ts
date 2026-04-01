import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER",
}

export interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,  // passowrds are not returned in queries
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>("User", userSchema);