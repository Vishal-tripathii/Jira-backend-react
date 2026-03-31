import express from "express";
import {connectDB} from "./src/config/db";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/health", (req, res) => {
  res.send("OK");
});

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running on port 5000");
  });
};

startServer();