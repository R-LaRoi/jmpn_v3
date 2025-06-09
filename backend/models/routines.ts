import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutine extends Document {
  duration: string;
  type: string;
  level: string;
  date: string;
  weekday: string;
  exercises: string[];
}

const routineSchema: Schema = new Schema({
  duration: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  date: { type: String, required: true },
  weekday: { type: String, required: true },
  exercises: { type: [String], required: true },
});

export default mongoose.model<IRoutine>('routines', routineSchema);