import express from 'express';
import Profile from '../models/profiles';
const router = express.Router();

// Get own profile
router.get('/:id', async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) return res.status(404).send('Profile not found');
  res.json(profile);
});

// Update own profile
router.put('/:id', async (req, res) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!profile) return res.status(404).send('Profile not found');
  res.json(profile);
});

export default router;