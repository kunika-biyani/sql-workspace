/**
 * LOCKED FILE. Do not modify.
 * Already-working read route: introspects the seeded workspace database.
 */

import { Router } from 'express';
import { getReadOnlyConnection, queryAll } from '../db';

export const schemaRouter = Router();

schemaRouter.get('/api/schema', async (_req, res, next) => {
  try {
    const db = await getReadOnlyConnection();
    try {
      const tableRows = await queryAll<{ name: string }>(
        db,
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
      );

      const tables = [];
      for (const { name } of tableRows) {
        const columns = await queryAll<{ name: string; type: string; pk: number }>(
          db,
          `PRAGMA table_info('${name}')`,
        );
        const foreignKeys = await queryAll<{ from: string; table: string; to: string }>(
          db,
          `PRAGMA foreign_key_list('${name}')`,
        );
        const [{ c: rowCount }] = await queryAll<{ c: number }>(db, `SELECT COUNT(*) AS c FROM "${name}"`);

        tables.push({
          name,
          columns: columns.map((col) => ({ name: col.name, type: col.type, primaryKey: Boolean(col.pk) })),
          foreignKeys: foreignKeys.map((fk) => ({
            column: fk.from,
            referencesTable: fk.table,
            referencesColumn: fk.to,
          })),
          rowCount,
        });
      }

      res.json({ tables });
    } finally {
      db.close();
    }
  } catch (err) {
    next(err);
  }
});
