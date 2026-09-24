import { useEffect, useState } from 'react';
import { getSchema, getHistory, type SchemaTable, type HistoryEntry, type QueryResult } from './api';
import SchemaBrowser from './components/SchemaBrowser';
import HistoryPanel from './components/HistoryPanel';
import ResultsTable from './components/ResultsTable';

function App() {
  const [tables, setTables] = useState<SchemaTable[] | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshHistory() {
    const res = await getHistory();
    setHistory(res.entries);
  }

  useEffect(() => {
    getSchema().then((res) => setTables(res.tables));
    refreshHistory();
  }, []);

  // TODO: not implemented yet.
  function handleRun() {
    setError(null);
    setResult(null);
    setLoading(true);
    console.log('run clicked, not implemented yet:', sql);
    setLoading(false);
  }

  // TODO: not implemented yet.
  function handlePrevPage() {
    console.log('prev page clicked, not implemented yet');
  }

  // TODO: not implemented yet.
  function handleNextPage() {
    console.log('next page clicked, not implemented yet');
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">SQL Workspace</span>
      </header>
      <div className="app-body">
        <SchemaBrowser tables={tables} onInsertQuery={setSql} />
        <div className="app-center">
          <div className="query-editor">
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SELECT * FROM customers"
              rows={6}
              spellCheck={false}
            />
            <button className="run-button" onClick={handleRun}>
              Run
            </button>
          </div>
          <ResultsTable
            result={result}
            error={error}
            loading={loading}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>
        <HistoryPanel entries={history} onSelect={setSql} />
      </div>
    </div>
  );
}

export default App;
