/**
 * Validates request body for task creation and updates.
 * Returns 400 with a descriptive message on invalid input.
 */
function validateTask(req, res, next) {
  const { title, priority, status } = req.body;

  // title is required only on POST
  if (req.method === 'POST' && (!title || typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (title && title.length > 100) {
    return res.status(400).json({ error: 'Title cannot exceed 100 characters' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority !== undefined && !validPriorities.includes(priority)) {
    return res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(', ')}` });
  }

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  next();
}

module.exports = { validateTask };
