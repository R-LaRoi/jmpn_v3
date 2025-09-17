import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import { Profile } from "./models/profileSchema";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    ProfileId: string;
    email: string;
  };
}

const app = express();
const port = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// CORS configuration to allow credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Changed from 3000 to 5173
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// JWT Authentication Middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Check for token in cookie first, then Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { ProfileId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send({ data: "started" });
});

// Updated signup endpoint to match frontend
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  console.log("Server: /api/auth/signup endpoint called");
  const { email, password, full_name } = req.body;

  try {
    const activeProfile = await Profile.findOne({ email });
    if (activeProfile) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const newProfile = await Profile.create({ 
      username: full_name, // Map full_name to username
      email, 
      password: encryptedPassword 
    });

    // Create JWT token
    const token = jwt.sign(
      { ProfileId: newProfile._id, email: newProfile.email },
      JWT_SECRET,
      { expiresIn: "7d" } // Longer expiry for better UX
    );

    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newProfile._id,
        email: newProfile.email,
        full_name: newProfile.username
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Updated signin endpoint to match frontend
app.post("/api/auth/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const activeProfile = await Profile.findOne({ email });
    if (!activeProfile) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, activeProfile.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { ProfileId: activeProfile._id, email: activeProfile.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("User signed in:", activeProfile._id.toString());

    res.json({
      message: "Signed in successfully",
      user: {
        _id: activeProfile._id,
        email: activeProfile.email,
        full_name: activeProfile.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// New /me endpoint to get current user
app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await Profile.findById(req.user.ProfileId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      full_name: user.username
    });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// New signout endpoint
app.post("/api/auth/signout", (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: "Signed out successfully" });
});

// Keep legacy endpoints for backward compatibility
app.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const activeProfile = await Profile.findOne({ email });
    if (activeProfile) {
      if (activeProfile.username === username) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    await Profile.create({ username, email, password: encryptedPassword });
    res.send("User registered successfully");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

app.post("/login-user", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const activeProfile = await Profile.findOne({ email });
    if (!activeProfile) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, activeProfile.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { ProfileId: activeProfile._id, email: activeProfile.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Active user ID:", activeProfile._id.toString());
      console.log(
        "Response:",
        JSON.stringify({
          status: "ok",
          data: token,
          userType: "user",
          username: activeProfile.username,
          userId: activeProfile._id.toString(),
        })
      );

      res.json({
        status: "ok",
        data: token,
        userType: "user",
        username: activeProfile.username,
        userId: activeProfile._id.toString(),
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

function createObjectId(idString: string): mongoose.Types.ObjectId | null {
  if (mongoose.isValidObjectId(idString)) {
    return new mongoose.Types.ObjectId(idString);
  } else {
    return null;
  }
}

// Protected route - save routine (now requires authentication)
app.post("/save-routine", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Received data:", req.body);
    const {
      userId: userIdString,
      duration,
      type,
      level,
      date,
      weekday,
      exercises,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Use authenticated user's ID if not provided
    const userId = userIdString || req.user.ProfileId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Ensure user can only save routines for themselves
    if (userId !== req.user.ProfileId.toString()) {
      return res.status(403).json({ error: "Cannot save routine for another user" });
    }

    // Validate exercises format
    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({
        error: "exercises must be an array of strings",
      });
    }

    // Ensure all exercises are strings
    const exercisesArray = exercises.map((ex: any) =>
      typeof ex === "string" ? ex : String(ex)
    );

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Create the new routine object with validated data
    const newRoutine = {
      duration: String(duration),
      type: String(type),
      level: String(level),
      date: String(date),
      weekday: String(weekday),
      exercises: exercisesArray,
    };

    console.log("Formatted routine to save:", newRoutine);

    // Find the user first
    const user = await Profile.findById(userObjectId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the routine to the user's routines array
    user.routines.push(newRoutine);
    console.log("User routines before save:", user.routines);
    // Save the user document
    await user.save();

    return res.status(200).json({
      message: "Routine saved successfully!",
      routine: newRoutine,
    });
  } catch (error) {
    console.error("Error saving routine:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Protected route - get weekly routines
app.get("/weekly-routines/:userId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Ensure user can only access their own routines
    if (userId !== req.user.ProfileId.toString()) {
      return res.status(403).json({ error: "Cannot access another user's routines" });
    }

    // Validate userId format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Find user and get their routines
    const user = await Profile.findById(userId).select("routines");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ routines: user.routines });
  } catch (error) {
    console.error("Error fetching routines:", error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Protected route - get specific routine
app.get("/routine/:userId/:routineId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, routineId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Ensure user can only access their own routines
    if (userId !== req.user.ProfileId.toString()) {
      return res.status(403).json({ error: "Cannot access another user's routine" });
    }

    console.log(
      "Fetching routine details for userId:",
      userId,
      "and routineId:",
      routineId
    );

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(routineId)
    ) {
      return res.status(400).json({ error: "Invalid user or routine ID" });
    }

    const user = await Profile.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const routine = user.routines.find((r: any) => r._id.toString() === routineId);

    if (!routine) {
      return res.status(404).json({ error: "Routine not found" });
    }
    console.log("Routine found:", routine);

    res.status(200).json({ routine });
  } catch (error) {
    console.error("Error fetching routine details:", error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Protected route - get monthly routines
app.get("/monthly-routines/:userId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Ensure user can only access their own routines
    if (userId !== req.user.ProfileId.toString()) {
      return res.status(403).json({ error: "Cannot access another user's routines" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const user = await Profile.findById(userId).select("routines");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const routines = user.routines;

    // Group routines by month
    const monthlyRoutines = routines.reduce((acc: any, routine: any) => {
      const dateString = routine.date;
      const dateParts = dateString.split(", ");
      const dateOnly = dateParts[1];
      const dateObj = new Date(dateOnly);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();

      const monthKey = `${year}-${month + 1}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: month + 1,
          year: year,
          routines: [],
        };
      }

      acc[monthKey].routines.push(routine);
      return acc;
    }, {});

    const monthlyRoutinesArray = Object.values(monthlyRoutines);

    res.status(200).json({ monthlyRoutines: monthlyRoutinesArray });
  } catch (error) {
    console.error("Error fetching monthly routines:", error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

connectDB();