// server/index.js
import express from "express";
import uploadRouter from "./uploadToGithub.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

// API route
app.use("/api", uploadRouter);

// Serve Vite production build (for Render single-service setup)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ SvasthOl backend running on port ${PORT}`));

