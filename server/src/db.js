const mongoose = require('mongoose');

// In-memory store used as a fallback when MongoDB is not available
let useInMemory = false;
let inMemoryTasks = [];
let nextId = 1;

function generateId() {
  return String(nextId++);
}

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'none') {
    console.log('[DB] No MONGO_URI set — using in-memory store');
    useInMemory = true;
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.warn(`[DB] MongoDB unavailable (${err.message}) — falling back to in-memory store`);
    useInMemory = true;
  }
}

function isInMemory() {
  return useInMemory;
}

// ── In-memory CRUD helpers (mirror the Mongoose API shape) ──────────────────

function memFind(filter = {}) {
  let tasks = [...inMemoryTasks];

  if (filter.status) tasks = tasks.filter((t) => t.status === filter.status);
  if (filter.priority) tasks = tasks.filter((t) => t.priority === filter.priority);

  return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function memFindById(id) {
  return inMemoryTasks.find((t) => t._id === id) || null;
}

function memCreate(data) {
  const now = new Date().toISOString();
  const task = {
    _id: generateId(),
    title: data.title,
    description: data.description || '',
    priority: data.priority || 'medium',
    status: data.status || 'todo',
    assignedTo: data.assignedTo || '',
    createdAt: now,
    updatedAt: now,
  };
  inMemoryTasks.push(task);
  return { ...task };
}

function memUpdate(id, data) {
  const idx = inMemoryTasks.findIndex((t) => t._id === id);
  if (idx === -1) return null;

  const allowed = ['title', 'description', 'priority', 'status', 'assignedTo'];
  allowed.forEach((key) => {
    if (data[key] !== undefined) inMemoryTasks[idx][key] = data[key];
  });
  inMemoryTasks[idx].updatedAt = new Date().toISOString();

  return { ...inMemoryTasks[idx] };
}

function memDelete(id) {
  const idx = inMemoryTasks.findIndex((t) => t._id === id);
  if (idx === -1) return null;
  const [deleted] = inMemoryTasks.splice(idx, 1);
  return deleted;
}

// Reset helper for tests
function _resetMemory() {
  inMemoryTasks = [];
  nextId = 1;
  useInMemory = true;
}

module.exports = { connectDB, isInMemory, memFind, memFindById, memCreate, memUpdate, memDelete, _resetMemory };
