import mongoose from "mongoose";

export const routineSchema = new mongoose.Schema({
  duration: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  date: { type: String, required: true },
  weekday: { type: String, required: true },
  exercises: { type: [String], required: true },
});

export const Routine = mongoose.model("routines", routineSchema);
