import express from "express";
import connectDB from "./config/db.js";
import { Profile } from "./models/profileSchema.js";
// import { Routine } from "./models/routineSchema.js";
import cors from "cors";
import bcrypt from "bcryptjs"; // Changed from bcrypt to bcryptjs
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Routes
app.get("/", (req, res) => {
  res.send({ data: "started" });
});

app.post("/register", async (req, res) => {
  console.log("Server: /register endpoint called");
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

app.post("/login-user", async (req, res) => {
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

app.post("/save-routine", async (req, res) => {
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

    if (!userIdString) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.isValidObjectId(userIdString)) {
      return res.status(400).json({ error: "Invalid userId format" });
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

    const userId = new mongoose.Types.ObjectId(userIdString);

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
    const user = await Profile.findById(userId);
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

app.get("/weekly-routines/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

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

app.get("/routine/:userId/:routineId", async (req, res) => {
  try {
    const { userId, routineId } = req.params;

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

app.get("/monthly-routines/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

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