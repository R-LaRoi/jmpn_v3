import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: Date;
  password?: string;
}

const ProfileSchema: Schema = new Schema({
  email: { type: String, required: true },
  full_name: { type: String, default: '' },
  avatar_url: { type: String },
  created_at: { type: Date, default: Date.now },
  password: { type: String, required: true }, 
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);