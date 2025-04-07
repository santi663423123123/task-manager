import express from 'express';
import { State } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const states = await State.findAll({
      attributes: ['id', 'nombre', 'color'],
    });
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const state = await State.findByPk(req.params.id);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json(state);
  } catch (error) {
    console.error('Error fetching state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, color } = req.body;
    const newState = await State.create({ nombre, color });
    res.status(201).json(newState);
  } catch (error) {
    console.error('Error creating state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, color } = req.body;
    const state = await State.findByPk(req.params.id);

    if (!state) return res.status(404).json({ error: 'State not found' });

    await state.update({ nombre, color });
    res.json(state);
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const state = await State.findByPk(req.params.id);

    if (!state) return res.status(404).json({ error: 'State not found' });

    await state.destroy();
    res.json({ message: 'State deleted' });
  } catch (error) {
    console.error('Error deleting state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
