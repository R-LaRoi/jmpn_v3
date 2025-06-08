import express from 'express';
import Routine from '../models/routines.ts';
const router = express.Router();

// Get routines for user
router.get('/user/:user_id', async (req, res) => {
  const routines = await Routine.find({ user_id: req.params.user_id }).sort({ date: -1 });
  res.json(routines);
});

// Create routine
router.post('/', async (req, res) => {
  const routine = new Routine(req.body);
  await routine.save();
  res.status(201).json(routine);
});

// Update routine
router.put('/:id', async (req, res) => {
  const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!routine) return res.status(404).send('Routine not found');
  res.json(routine);
});

// Delete routine
router.delete('/:id', async (req, res) => {
  const routine = await Routine.findByIdAndDelete(req.params.id);
  if (!routine) return res.status(404).send('Routine not found');
  res.send('Routine deleted');
});

export default router;