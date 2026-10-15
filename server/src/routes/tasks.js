const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { isInMemory, memFind, memFindById, memCreate, memUpdate, memDelete } = require('../db');
const { validateTask } = require('../middleware/validate');

// GET /api/tasks  — list all tasks, optional ?status= and ?priority= filters
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;

    if (isInMemory()) {
      const filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      return res.json(memFind(filter));
    }

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// GET /api/tasks/:id  — get a single task
router.get('/:id', async (req, res) => {
  try {
    if (isInMemory()) {
      const task = memFindById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json(task);
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Task not found' });
    res.status(500).json({ error: 'Failed to fetch task', details: err.message });
  }
});

// POST /api/tasks  — create a new task
router.post('/', validateTask, async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo } = req.body;

    if (isInMemory()) {
      const task = memCreate({ title: title.trim(), description, priority, status, assignedTo });
      return res.status(201).json(task);
    }

    const task = await Task.create({ title: title.trim(), description, priority, status, assignedTo });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// PUT /api/tasks/:id  — full or partial update
router.put('/:id', validateTask, async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo } = req.body;
    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description;
    if (priority !== undefined) update.priority = priority;
    if (status !== undefined) update.status = status;
    if (assignedTo !== undefined) update.assignedTo = assignedTo;

    if (isInMemory()) {
      const task = memUpdate(req.params.id, update);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json(task);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Task not found' });
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
});

// DELETE /api/tasks/:id  — delete a task
router.delete('/:id', async (req, res) => {
  try {
    if (isInMemory()) {
      const task = memDelete(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.json({ message: 'Task deleted', task });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', task });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Task not found' });
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
});

module.exports = router;
