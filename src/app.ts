// src/app.ts

import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate } from "./modules/middleware/auth.middleware";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/protected", authenticate, (req: any, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected route",
    user: req.user,
  });
}); 


app.get("/health", (req, res) => {
  res.send("OK");
});

export default app;