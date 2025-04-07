import express from 'express';
import { Priority } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const priorities = await Priority.findAll({
      attributes: ['id', 'nombre', 'color'],
    });
    res.json(priorities);
  } catch (error) {
    console.error('Error fetching priorities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const priority = await Priority.findByPk(req.params.id);
    if (!priority) return res.status(404).json({ error: 'Priority not found' });
    res.json(priority);
  } catch (error) {
    console.error('Error fetching priority:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, color } = req.body;
    const newPriority = await Priority.create({ nombre, color });
    res.status(201).json(newPriority);
  } catch (error) {
    console.error('Error creating priority:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, color } = req.body;
    const priority = await Priority.findByPk(req.params.id);

    if (!priority) return res.status(404).json({ error: 'Priority not found' });

    await priority.update({ nombre, color });
    res.json(priority);
  } catch (error) {
    console.error('Error updating priority:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const priority = await Priority.findByPk(req.params.id);

    if (!priority) return res.status(404).json({ error: 'Priority not found' });

    await priority.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting priority:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
