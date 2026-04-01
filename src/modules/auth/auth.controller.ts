import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await authService.registerUser(email, password);

        return res.status(201).json({
            success: true,
            data: user,
        });
    } catch (err: any) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export const UserLogin = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await authService.loginUser(email, password);
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err: any) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
}