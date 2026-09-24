/**
 * LOCKED FILE. Do not modify. Already-working schema browser.
 */

import type { SchemaTable } from '../api';

interface SchemaBrowserProps {
  tables: SchemaTable[] | null;
  onInsertQuery: (sql: string) => void;
}

export default function SchemaBrowser({ tables, onInsertQuery }: SchemaBrowserProps) {
  if (!tables) {
    return <div className="panel schema-browser">Loading schema...</div>;
  }

  return (
    <div className="panel schema-browser">
      <h3>Schema</h3>
      {tables.map((table) => (
        <div key={table.name} className="schema-table">
          <button
            className="schema-table-name"
            onClick={() => onInsertQuery(`SELECT * FROM ${table.name}`)}
            title="Insert a starter query for this table"
          >
            {table.name}
            <span className="schema-table-count">{table.rowCount}</span>
          </button>
          <div className="schema-columns">
            {table.columns.map((col) => (
              <div key={col.name} className="schema-column">
                <span className={col.primaryKey ? 'schema-column-name pk' : 'schema-column-name'}>
                  {col.name}
                </span>
                <span className="schema-column-type">{col.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
