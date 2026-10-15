/**
 * Task API tests — uses the in-memory store (no MongoDB needed)
 */
const request = require('supertest');
const app = require('../src/app');
const { _resetMemory } = require('../src/db');

beforeEach(() => {
  _resetMemory();
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/tasks', () => {
  it('creates a task with valid data', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Build frontend',
      description: 'React kanban UI',
      priority: 'high',
      status: 'todo',
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Build frontend');
    expect(res.body.priority).toBe('high');
    expect(res.body._id).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'low' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('returns 400 for invalid priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Test', priority: 'urgent' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/priority/i);
  });

  it('returns 400 for invalid status', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Test', status: 'blocked' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/status/i);
  });

  it('uses default priority (medium) and status (todo) when omitted', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Minimal task' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('medium');
    expect(res.body.status).toBe('todo');
  });
});

describe('GET /api/tasks', () => {
  it('returns an empty array initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all created tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task A' });
    await request(app).post('/api/tasks').send({ title: 'Task B' });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('filters by status', async () => {
    await request(app).post('/api/tasks').send({ title: 'Todo task', status: 'todo' });
    await request(app).post('/api/tasks').send({ title: 'Done task', status: 'done' });
    const res = await request(app).get('/api/tasks?status=done');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Done task');
  });

  it('filters by priority', async () => {
    await request(app).post('/api/tasks').send({ title: 'High task', priority: 'high' });
    await request(app).post('/api/tasks').send({ title: 'Low task', priority: 'low' });
    const res = await request(app).get('/api/tasks?priority=high');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('High task');
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns a task by id', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Single task' });
    const id = created.body._id;
    const res = await request(app).get(`/api/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/tasks/99999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('updates a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Old title', status: 'todo' });
    const id = created.body._id;
    const res = await request(app).put(`/api/tasks/${id}`).send({ title: 'New title', status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
    expect(res.body.status).toBe('done');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/tasks/99999').send({ title: 'x' });
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid status on update', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Task' });
    const id = created.body._id;
    const res = await request(app).put(`/api/tasks/${id}`).send({ status: 'invalid' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'To delete' });
    const id = created.body._id;
    const res = await request(app).delete(`/api/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('returns 404 after deletion', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Gone' });
    const id = created.body._id;
    await request(app).delete(`/api/tasks/${id}`);
    const res = await request(app).get(`/api/tasks/${id}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/tasks/99999');
    expect(res.status).toBe(404);
  });
});
