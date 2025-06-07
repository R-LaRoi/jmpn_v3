import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profiles';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jmpn-fit';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Mock endpoints (replace with real implementations as needed)
app.post('/api/password-reset', (req, res) => {
  res.status(200).json({ message: "Password reset email sent (mock)" });
});

app.get('/api/user/profile', (req, res) => {
  res.json({ email: "demo@example.com", fullName: "Demo User" });
});

app.get('/api/routines', (req, res) => {
  res.json([]);
});

app.post('/api/routines', (req, res) => {
  res.status(201).json({ ...req.body, _id: "mockid", created_at: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));