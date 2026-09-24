/**
 * LOCKED FILE. Do not modify.
 * App bootstrap: CORS + route registration only. Add new endpoints inside
 * src/routes/*.ts, not here.
 */

import cors from 'cors';
import express from 'express';
import { historyRouter } from './routes/history';
import { queryRouter } from './routes/query';
import { schemaRouter } from './routes/schema';

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(schemaRouter);
app.use(historyRouter);
app.use(queryRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`SQL Workspace server listening on http://localhost:${PORT}`);
});
