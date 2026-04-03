// src/app.ts

import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { allowRoles, authenticate } from "./modules/middleware/auth.middleware";
import issueRoutes from "./modules/issue/issue.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/issue", authenticate, issueRoutes);
app.use("/protected", authenticate, (req: any, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected route",
    user: req.user,
  });
}); 

app.get("/dashboard", authenticate, allowRoles(['MANAGER', 'ADMIN']), (req: any, res) => {
  res.json({
    success: true,
    message: "Welcome to the dashboard!",
    user: req.user,
  });
});


app.get("/health", authenticate, (req, res) => {
  res.send("OK");
});

export default app;