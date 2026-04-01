// src/app.ts

import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("OK");
});

export default app;