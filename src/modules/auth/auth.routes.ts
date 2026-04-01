import { Router } from "express";
import { register } from "./auth.controller";
import { validateRegister } from "../middleware/validateRegister";

const router = Router();

router.post("/register", validateRegister, register);

export default router;