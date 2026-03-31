# Minimal Express + TypeScript Setup

## Setup

npm init -y
npm install express
npm install -D typescript ts-node @types/node @types/express nodemon
npx tsc --init

## tsconfig.json (minimal)

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}

## index.ts

import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


"scripts": {
  "dev": "nodemon --exec ts-node index.ts"
}

## Run

npm run dev


http://localhost:5000/health
