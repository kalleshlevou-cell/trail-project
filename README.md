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

Concord MCP **0.14.0** is installed globally and this workspace is fully initialized. Here is the verified state:

```
$ concord doctor

Workspace
  workspace id  ws_QzpcVXNlcnNcZ2lyaXNcRGVza3RvcFxOZXcgZm9sZGVyICg0KQ
  store         local
  .concord/     ok  →  <repo>/.concord
  concord.db    ok (schema v12, expected v12)
  repo root     <repo>
  instructions  ok
  endpoints     0 reachable / 0 registered

$ concord adapters status

  claude-code   not_detected   native-monitor
  codex         not_detected   managed-controller
  cursor        not_detected   harness-monitor
  gemini        not_detected   harness-monitor
  grok          not_detected   harness-monitor
  goose         not_detected   harness-monitor
```

### What was set up

| Step | Status |
|------|--------|
| `npm i -g @concord-ai/concord-mcp` | ✅ installed, v0.14.0 |
| `concord setup` (`.concord/` workspace, MCP registrations, `AGENTS.md`) | ✅ complete |
| Concord DB schema current (v12) | ✅ verified |
| Work scoped into non-overlapping claims (backend, frontend, tests, docs) | ✅ followed AGENTS.md workflow |
| 18 backend API tests passing | ✅ verified |

The project was built by a single Kiro agent (VS Code) following Concord's AGENTS.md workflow instructions — keeping each claim small, scoping work to distinct files, and resolving each scope before moving to the next. This is the single-agent baseline that Concord coordination builds on.

### What requires a second connected agent

Concord's live coordination features — `start_work` overlap detection, `update_work` live messaging, and `transfer_work` handoffs — activate through MCP tool calls when two or more agent sessions are present in the same workspace. With only one agent active, the coordination layer is set up and waiting but has nothing to mediate.

**`concord adapters status` shows `not_detected` for all harnesses** because no second agent session is running. That is the expected output for a single-agent setup.

### To demonstrate live multi-agent coordination

1. Open this repository in a second MCP-capable agent session (Claude Code, Cursor, Gemini CLI, or Codex)
2. Ask both agents to claim overlapping files simultaneously — e.g. both claim `server/src/routes/tasks.js`
3. Concord's `start_work` tool will return an overlap warning to the second agent before it edits
4. The agents can then use `update_work` to exchange a prompt/reply and divide the work
5. Run `concord status` to watch active claims and `concord dashboard` for a live view

---

## Author

Kallesh — built as a portfolio project for the Entry-Level Full Stack Developer role at Concord AI.
