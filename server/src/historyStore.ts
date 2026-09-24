/**
 * LOCKED FILE. Do not modify.
 *
 * Stores executed-query history in its own sqlite file, kept apart from the
 * workspace database so this bookkeeping never shows up in the schema
 * browser. Call recordHistory() from your execute route after a query
 * runs, whether it succeeded or failed. listHistory() already powers
 * GET /api/history.
 */

import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const HISTORY_DB_PATH = path.join(__dirname, '..', 'data', 'history.db');

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS query_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sql_text TEXT NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    row_count INTEGER,
    duration_ms INTEGER,
    created_at INTEGER NOT NULL
  );
`;

function withConnection<T>(fn: (db: sqlite3.Database) => Promise<T>): Promise<T> {
  fs.mkdirSync(path.dirname(HISTORY_DB_PATH), { recursive: true });
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(HISTORY_DB_PATH, (err) => {
      if (err) return reject(err);
      db.run(INIT_SQL, (initErr) => {
        if (initErr) return reject(initErr);
        fn(db)
          .then((result) => db.close(() => resolve(result)))
          .catch((fnErr) => db.close(() => reject(fnErr)));
      });
    });
  });
}

export interface HistoryEntry {
  id: number;
  sql_text: string;
  status: string;
  error_message: string | null;
  row_count: number | null;
  duration_ms: number | null;
  created_at: number;
}

export function recordHistory(entry: {
  sqlText: string;
  status: string;
  rowCount?: number | null;
  durationMs?: number | null;
  errorMessage?: string | null;
}): Promise<void> {
  return withConnection(
    (db) =>
      new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO query_history (sql_text, status, error_message, row_count, duration_ms, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            entry.sqlText,
            entry.status,
            entry.errorMessage ?? null,
            entry.rowCount ?? null,
            entry.durationMs ?? null,
            Date.now(),
          ],
          (err) => (err ? reject(err) : resolve()),
        );
      }),
  );
}

export function listHistory(limit = 50): Promise<HistoryEntry[]> {
  return withConnection(
    (db) =>
      new Promise((resolve, reject) => {
        db.all(
          `SELECT id, sql_text, status, error_message, row_count, duration_ms, created_at
           FROM query_history ORDER BY id DESC LIMIT ?`,
          [limit],
          (err, rows) => (err ? reject(err) : resolve(rows as HistoryEntry[])),
        );
      }),
  );
}
