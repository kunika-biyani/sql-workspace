/**
 * LOCKED FILE. Do not modify.
 *
 * Every backend call the app needs already exists here, including one for
 * a feature that is not wired into the UI yet (running a query). Import
 * what you need from this file rather than writing your own fetch calls.
 */

const BASE_URL = 'http://localhost:4000';

export interface SchemaColumn {
  name: string;
  type: string;
  primaryKey: boolean;
}

export interface SchemaForeignKey {
  column: string;
  referencesTable: string;
  referencesColumn: string;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  foreignKeys: SchemaForeignKey[];
  rowCount: number;
}

export interface SchemaResponse {
  tables: SchemaTable[];
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

export interface HistoryResponse {
  entries: HistoryEntry[];
}

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  page: number;
  pageSize: number;
  totalRows: number;
  durationMs: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export function getSchema() {
  return request<SchemaResponse>('/api/schema');
}

export function getHistory() {
  return request<HistoryResponse>('/api/history');
}

export function runQuery(sql: string, page: number, pageSize: number) {
  return request<QueryResult>('/api/query/execute', {
    method: 'POST',
    body: JSON.stringify({ sql, page, pageSize }),
  });
}
