import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Profile from '../models/profiles'
import { IProfile } from '../models/profiles'; 
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, full_name } = req.body
  try {
    const existing = await Profile.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })
    const hash = await bcrypt.hash(password, 10)
    const profile = new Profile({ email, full_name, password: hash })
    await profile.save()
    res.json({ message: 'Account created! You may now sign in.' })
  } catch (e) {
    res.status(500).json({ error: 'Signup error' })
  }
})

// Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    const profile = await Profile.findOne({ email }) as IProfile; // Cast to IProfile
    if (!profile) return res.status(400).json({ error: 'Invalid email or password' })
    if (!profile.password) return res.status(400).json({ error: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, profile.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' })
    const token = jwt.sign({ id: profile._id, email: profile.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Signed in!', token })
  } catch (e) {
    res.status(500).json({ error: 'Signin error' })
  }
})

// Reset (send email etc, left as stub)
router.post('/reset', async (req, res) => {
  // In production: send email with reset link/token.
  res.json({ message: 'Password reset link sent (not implemented)' })
})

export default router