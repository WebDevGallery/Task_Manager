import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Database connection
 */
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ DB connection established");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1); // Optional: exit process if DB connection fails
  }
};

/**
 * Create JWT and send it as cookie
 */
export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Ensures cookies sent over HTTPS only
    sameSite: "none", // Important for cross-site cookies (frontend + backend on different domains)
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};
