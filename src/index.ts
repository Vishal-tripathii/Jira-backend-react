import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// health check
app.get("/health", (req, res) => {
  res.send("Alive and Kicking :)");
});

app.post("/users", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});