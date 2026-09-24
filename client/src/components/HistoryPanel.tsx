/**
 * LOCKED FILE. Do not modify. Already-working history list.
 */

import type { HistoryEntry } from '../api';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (sql: string) => void;
}

export default function HistoryPanel({ entries, onSelect }: HistoryPanelProps) {
  return (
    <div className="panel history-panel">
      <h3>History</h3>
      {entries.length === 0 && <p className="history-empty">No queries run yet.</p>}
      {entries.map((entry) => (
        <button key={entry.id} className="history-entry" onClick={() => onSelect(entry.sql_text)}>
          <span className={entry.status === 'ok' ? 'history-status ok' : 'history-status error'}>
            {entry.status}
          </span>
          <span className="history-sql">{entry.sql_text}</span>
          {entry.row_count !== null && <span className="history-meta">{entry.row_count} rows</span>}
          {entry.duration_ms !== null && <span className="history-meta">{entry.duration_ms} ms</span>}
        </button>
      ))}
    </div>
  );
}
