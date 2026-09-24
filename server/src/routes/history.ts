/**
 * LOCKED FILE. Do not modify.
 * Already-working read route: recent query history.
 */

import { Router } from 'express';
import { listHistory } from '../historyStore';

export const historyRouter = Router();

historyRouter.get('/api/history', async (_req, res, next) => {
  try {
    const entries = await listHistory();
    res.json({ entries });
  } catch (err) {
    next(err);
  }
});
