import { Router } from "express";
import { register, UserLogin } from "./auth.controller";
import { validateAuth } from "../middleware/validateRegister";

const router = Router();

router.post("/register", validateAuth, register);
router.post("/login", validateAuth, UserLogin);

export default router;