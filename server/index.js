import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";
import { dbConnection } from "./utils/index.js";
import routes from "./routes/index.js";

dotenv.config();

// Initialize database
dbConnection();

// Create app
const app = express();

// CORS settings
app.use(
  cors({
    origin: [
      "https://task-manager-ashen-two.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Base route (fix for "Route not found: /")
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api", routes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

// Export app for Vercel (❗️Important)
export default app;

// Only run listen() if not on Vercel (for local dev)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
