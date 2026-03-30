# Taskr — Todo / Task Manager

Full-stack task manager. React frontend, Express backend, JSON file storage.
**Zero native modules — works on any Node version.**

## Stack
- Frontend: React 18 + Vite (port 5173)
- Backend: Express (port 3001)
- Storage: `backend/data/tasks.json` (auto-created)

## Setup

```bash
chmod +x setup.sh && ./setup.sh
```

## Run

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**

## Features
- Create tasks with title, description, priority, due date
- Mark complete / incomplete
- Pin important tasks to the top
- Filter by status (all / active / done)
- Filter by priority (high / medium / low)
- Search tasks
- Progress bar + stats
- Clear all completed tasks
- Data persists in a JSON file
- Double-click any task title to edit inline

## API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| DELETE | `/api/tasks/completed/all` | Clear completed |
| GET | `/api/stats` | Task statistics |
