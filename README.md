# SQL Workspace

Internal teams need a lightweight way to browse a database and run queries against it under realistic conditions: several people using it at the same time, not everyone should be able to change data, and sometimes people need to fix or update records, not just look at them. This repo is the starting point for that tool.

Stack: Node.js (Express, TypeScript) on the backend, React (TypeScript, Vite) on the frontend, a real seeded SQLite database underneath.

## The problem

The schema browser, query history, and results view already work. Running a query does not. Your job is to make this into a query tool a team could actually rely on, not one that only works for a single person typing SELECT statements alone in a room.

## Requirements

- A user can write a SQL query and see real rows come back from the real database.
- Large result sets are paginated. The whole table is never returned at once, and paging forward and backward both work.
- Reading data should be open to anyone using the tool. Changing data should not be.
- Beyond reading, someone allowed to should be able to insert, update, and delete real data through the same tool.
- More than one person can be using this at the same time. That should not corrupt data, silently drop someone's change, or leave the tool in a broken state.
- Anything that shouldn't run against a shared tool like this is rejected before it runs, with a clear reason given back to the user, not a generic failure.
- A single expensive query cannot hang the server for anyone else using it at the same time.
- Every attempt, whether it succeeds or fails, shows up afterward in query history.

## Constraints

- One database, the one already seeded here. No connecting to anything external.
- A small fixed set of users is enough. There is no requirement to build registration, password reset, or a full identity system.
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
