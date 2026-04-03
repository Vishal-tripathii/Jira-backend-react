import { Request, Response } from "express";
import * as authService from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { STATUS_CODE_201, STATUS_CODE_200 } from "../../utils/statusCodes";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.registerUser(email, password);

  return res.status(STATUS_CODE_201).json({
    success: true,
    data: user,
  });
});

export const UserLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.loginUser(email, password);

  return res.status(STATUS_CODE_200).json({
    success: true,
    data: user,
  });
});
