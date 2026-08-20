import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
