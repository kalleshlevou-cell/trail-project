# AI Team Task Manager

A full-stack Kanban task manager built with **React + Vite**, **Node.js + Express**, and **MongoDB** (with an in-memory fallback). The project was developed using **Concord MCP** to coordinate multi-agent work across the frontend, backend, and testing responsibilities.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite 5, CSS             |
| Backend  | Node.js 22, Express 4             |
| Database | MongoDB via Mongoose (+ in-memory fallback) |
| Tests    | Jest, Supertest                   |
| Coordination | Concord MCP 0.14.0            |

---

## Features

- Kanban board with **To Do / In Progress / Done** columns
- Create, edit, and delete tasks
- Each task has: title, description, priority (low/medium/high), status, and assigned-to
- Filter tasks by status and priority
- Input validation and error handling on both frontend and backend
- MongoDB optional — falls back to in-memory store automatically
- 18 backend API tests

---

## Project Structure

```
.
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # KanbanBoard, TaskCard, TaskForm, FilterBar
│   │   ├── hooks/        # useTasks — API calls
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
├── server/               # Express REST API
│   ├── src/
│   │   ├── models/       # Mongoose Task schema
│   │   ├── routes/       # /api/tasks CRUD
│   │   ├── middleware/   # Input validation
│   │   ├── db.js         # MongoDB + in-memory fallback
│   │   ├── app.js
│   │   └── index.js
│   └── __tests__/        # Jest + Supertest API tests
└── .concord/             # Concord MCP workspace
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm

MongoDB is **optional**. If you don't have it, the server uses an in-memory store automatically.

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment (backend)

```bash
cd server
cp .env.example .env
```

Edit `.env` if you want to connect to MongoDB:

```env
PORT=5000
# Leave as "none" for in-memory fallback
MONGO_URI=none
# Or set your MongoDB URI:
# MONGO_URI=mongodb://localhost:27017/ai-task-manager
```

### 3. Run the backend

```bash
cd server
npm start
# → http://localhost:5000
```

### 4. Run the frontend

```bash
cd client
npm run dev
# → http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /tasks          | List all tasks       |
| GET    | /tasks?status=  | Filter by status     |
| GET    | /tasks?priority=| Filter by priority   |
| GET    | /tasks/:id      | Get a single task    |
| POST   | /tasks          | Create a task        |
| PUT    | /tasks/:id      | Update a task        |
| DELETE | /tasks/:id      | Delete a task        |
| GET    | /health         | Health check         |

### Task object

```json
{
  "_id": "1",
  "title": "Build the API",
  "description": "Express REST endpoints",
  "priority": "high",
  "status": "in-progress",
  "assignedTo": "Backend Agent",
  "createdAt": "2026-10-15T10:00:00.000Z",
  "updatedAt": "2026-10-15T10:30:00.000Z"
}
```

Valid values: `priority`: low | medium | high — `status`: todo | in-progress | done

---

## Running Tests

```bash
cd server
npm test
```

18 tests covering: create, read (list + filter), get by id, update, delete, and validation errors.

---

## How Concord MCP Was Used

This project was built with **Kiro** (a single agent) inside VS Code, which operates as an MCP-capable coding agent. Concord MCP 0.14.0 is installed and the workspace `.concord/` directory is initialized.

### What was done

- Concord was installed globally (`npm i -g @concord-ai/concord-mcp`) and the workspace is set up
- The AGENTS.md workflow instructions from Concord were injected into the session and followed
- Work was divided into distinct scoped tasks (backend API, frontend UI, tests, documentation) mirroring how separate agents would claim non-overlapping scopes
- Each stage was kept small and independently verifiable — the coordination pattern Concord enforces

### What was not tested

- **Live multi-agent messaging** (two simultaneous agent sessions resolving a file overlap) was not tested because only one agent session was active
- `start_work`, `finish_work`, and `inspect_work` MCP tool calls require a running Concord server process; in this session the tools were not available as callable MCP endpoints, only the workflow pattern was followed

### To test live multi-agent coordination

1. Open the same repository in two separate MCP-capable agent sessions (e.g. Claude Code + Cursor)
2. Ask both agents to edit the same file simultaneously
3. Concord will detect the overlap and route a conflict prompt to one agent before it writes

---

## Author

Kallesh — built as a portfolio project for the Entry-Level Full Stack Developer role at Concord AI.
