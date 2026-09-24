# SQL Workspace

Internal teams need a lightweight way to browse a database and run ad hoc queries against it, without handing everyone a terminal and production credentials. This repo is the starting point for that tool.

Stack: Node.js (Express, TypeScript) on the backend, React (TypeScript, Vite) on the frontend, a real seeded SQLite database underneath.

## The problem

The schema browser, query history, and results view already work. Running a query does not. Your job is to make it a real, safe query tool.

## Requirements

- A user can write a SQL query and see real rows come back from the real database.
- Large result sets are paginated. The whole table is never returned at once, and paging forward and backward both work.
- Anything that shouldn't run against a shared tool like this is rejected before it runs, with a clear reason given back to the user, not a generic failure.
- A single expensive query cannot hang the server for anyone else using it at the same time.
- Every attempt, whether it succeeds or fails, shows up afterward in query history.

## Constraints

- Read-only. There is no requirement to support inserting, updating, or deleting data.
- One database, the one already seeded here. No connecting to anything external.
- No user accounts or authentication. This is a single shared tool.
- Visual polish beyond what is already there is not the point of the exercise.

## Getting started

```
# From the repo root, once
node scripts/seed-db.js
bash scripts/lock-files.sh

# Terminal 1
cd server
npm install
npm run dev

# Terminal 2
cd client
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`.

A few files are locked (read-only on disk) because they're already-working infrastructure rather than part of the problem. If you find yourself needing to edit one, that's a sign to solve it a different way rather than to unlock it.
