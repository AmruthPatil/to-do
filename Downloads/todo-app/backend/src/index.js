import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// GET all tasks (with optional filter)
app.get('/api/tasks', (req, res) => {
  const { status, priority } = req.query;
  let { tasks } = readDb();
  if (status && status !== 'all') {
    tasks = tasks.filter(t =>
      status === 'completed' ? t.completed : !t.completed
    );
  }
  if (priority && priority !== 'all') {
    tasks = tasks.filter(t => t.priority === priority);
  }
  // Sort: pinned first, then by creation date desc
  tasks.sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  res.json({ tasks, total: tasks.length });
});

// POST create task
app.post('/api/tasks', (req, res) => {
  const { title, description = '', priority = 'medium', dueDate = null, tags = [] } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });

  const db = readDb();
  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    priority,
    dueDate,
    tags,
    completed: false,
    pinned: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  db.tasks.unshift(task);
  writeDb(db);
  res.status(201).json({ task });
});

// PATCH update task
app.patch('/api/tasks/:id', (req, res) => {
  const db = readDb();
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });

  const allowed = ['title', 'description', 'priority', 'dueDate', 'tags', 'completed', 'pinned'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (updates.completed === true && !db.tasks[idx].completedAt) {
    updates.completedAt = new Date().toISOString();
  } else if (updates.completed === false) {
    updates.completedAt = null;
  }

  db.tasks[idx] = { ...db.tasks[idx], ...updates };
  writeDb(db);
  res.json({ task: db.tasks[idx] });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const db = readDb();
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  db.tasks.splice(idx, 1);
  writeDb(db);
  res.json({ success: true });
});

// DELETE all completed
app.delete('/api/tasks/completed/all', (req, res) => {
  const db = readDb();
  const before = db.tasks.length;
  db.tasks = db.tasks.filter(t => !t.completed);
  writeDb(db);
  res.json({ deleted: before - db.tasks.length });
});

// GET stats
app.get('/api/stats', (req, res) => {
  const { tasks } = readDb();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t =>
    !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;
  const byPriority = {
    high: tasks.filter(t => !t.completed && t.priority === 'high').length,
    medium: tasks.filter(t => !t.completed && t.priority === 'medium').length,
    low: tasks.filter(t => !t.completed && t.priority === 'low').length,
  };
  res.json({ total, completed, pending: total - completed, overdue, byPriority });
});

// Health
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n✅ Todo API running → http://localhost:${PORT}`);
  console.log(`   Data stored in: backend/data/tasks.json\n`);
});
