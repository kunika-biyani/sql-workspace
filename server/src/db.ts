/**
 * LOCKED FILE. Do not modify.
 *
 * Read-only connection helper for the seeded workspace database. Opens the
 * file with sqlite3.OPEN_READONLY, so a write attempted through a
 * connection from here fails at the SQLite level regardless of anything
 * else. queryAll() is a small promise wrapper around the callback API,
 * nothing more.
 */

import path from 'path';
import sqlite3 from 'sqlite3';

export const DB_PATH = path.join(__dirname, '..', 'data', 'workspace.db');

export function getReadOnlyConnection(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

export function queryAll<T = Record<string, unknown>>(
  db: sqlite3.Database,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}
