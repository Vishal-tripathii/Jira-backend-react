import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model";

interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;


    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, secret, { expiresIn: "1h" });
};


export const verifyToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch (err) {
        const error: any = new Error("Invalid or expired token");
        error.status = 401;
        throw error;
    }
};