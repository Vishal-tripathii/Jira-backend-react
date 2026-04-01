import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

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
    comparePassword(candidatePassword: string): Promise<boolean>;
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

userSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);