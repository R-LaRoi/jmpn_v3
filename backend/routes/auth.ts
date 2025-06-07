import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Profile from '../models/profiles';
import cookieParser from 'cookie-parser'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const router = Router();

// Helper: extract user data without password
const getUserData = (profile: any) => ({
  _id: profile._id,
  email: profile.email,
  full_name: profile.full_name,
});
app.use(cookieParser());
// Signup
router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;
  try {
    const existing = await Profile.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const profile = new Profile({ email, full_name, password: hash });
    await profile.save();
    // auto-login after signup
    const token = jwt.sign({ id: profile._id, email: profile.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: getUserData(profile) });
  } catch (e) {
    res.status(500).json({ error: 'Signup error' });
  }
});

// Signin
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const profile = await Profile.findOne({ email });
    if (!profile || !profile.password) return res.status(400).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, profile.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: profile._id, email: profile.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: getUserData(profile) });
  } catch (e) {
    res.status(500).json({ error: 'Signin error' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const profile = await Profile.findById(payload.id);
    if (!profile) return res.status(401).json({ error: 'Not authenticated' });
    res.json(getUserData(profile));
  } catch (e) {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Signout
router.post('/signout', (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Signed out' });
});

// Password reset 
router.post('/reset', async (req: Request, res: Response) => {
  res.json({ message: 'Password reset link sent (not implemented)' });
});

export default router;