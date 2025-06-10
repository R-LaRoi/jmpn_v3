import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import { Profile } from "../models/profileSchema.js"; 

const app = express(); 

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

app.post("/api/profile-login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
   
    const userProfile = await Profile.findOne({ email });
    if (!userProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const isMatch = await bcrypt.compare(password, userProfile.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if JWT_SECRET exists
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate JWT token
    const token = jwt.sign({ id: userProfile._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: userProfile._id,
        email: userProfile.email,
        username: userProfile.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during login",
      error: getErrorMessage(error)
    });
  }
});
