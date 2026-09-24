/**
 * LOCKED FILE. Do not modify. Already-working results renderer.
 */

import type { QueryResult } from '../api';

interface ResultsTableProps {
  result: QueryResult | null;
  error: string | null;
  loading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function ResultsTable({ result, error, loading, onPrevPage, onNextPage }: ResultsTableProps) {
  if (loading) {
    return <div className="panel results-table results-empty">Running...</div>;
  }

  if (error) {
    return (
      <div className="panel results-table results-error">
        <strong>Query failed.</strong>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!result) {
    return <div className="panel results-table results-empty">Run a query to see results here.</div>;
  }

  const totalPages = Math.max(1, Math.ceil(result.totalRows / result.pageSize));

  return (
    <div className="panel results-table">
      <div className="results-toolbar">
        <span>
          {result.totalRows} row{result.totalRows === 1 ? '' : 's'} · {result.durationMs} ms
        </span>
        <div className="results-pagination">
          <button onClick={onPrevPage} disabled={result.page <= 1}>
            Prev
          </button>
          <span>
            Page {result.page} of {totalPages}
          </span>
          <button onClick={onNextPage} disabled={result.page >= totalPages}>
            Next
          </button>
        </div>
      </div>
      <div className="results-scroll">
        <table>
          <thead>
            <tr>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell === null ? <span className="results-null">null</span> : String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
