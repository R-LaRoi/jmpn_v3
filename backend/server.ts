import express from 'express';
import Routine from './models/routines.ts';
const router = express.Router();

// Get routines for user
router.get('/user/:user_id', async (req, res) => {
  try {
    const routines = await Routine.find({ user_id: req.params.user_id }).sort({ date: -1 });
    res.json(routines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

// Create routine
router.post('/', async (req, res) => {
  try {
    const routine = new Routine(req.body);
    await routine.save();
    res.status(201).json(routine);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create routine' });
  }
});

// Update routine
router.put('/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    res.json(routine);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update routine' });
  }
});

// Delete routine
router.delete('/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndDelete(req.params.id);
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    res.json({ message: 'Routine deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete routine' });
  }
});

export default router;