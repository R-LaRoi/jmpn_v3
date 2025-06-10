import mongoose from "mongoose";

const routineSchema = new mongoose.Schema({
  duration: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  date: { type: String, required: true },
  weekday: { type: String, required: true },
  exercises: { type: [String], required: true },
});

export const profileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  routines: [routineSchema],
});

export const Profile = mongoose.model("Profile", profileSchema);