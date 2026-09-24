/** Not implemented yet. */

import { Router } from 'express';

export const queryRouter = Router();

queryRouter.post('/api/query/execute', async (_req, res) => {
  res.status(501).json({ error: 'not implemented yet' });
});
