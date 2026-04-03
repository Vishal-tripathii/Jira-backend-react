import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model";
import { AppError } from "./errors";
import { STATUS_CODE_401 } from "./statusCodes";
import { MESSAGES } from "./messages";

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
    } catch (err: any) {
        // Wrap ALL JWT errors as AppError
        if (err.name === "TokenExpiredError") {
            throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.TOKEN_EXPIRED);
        }
        throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.INVALID_TOKEN);
    }
};