#!/usr/bin/env bash
# Marks the already-working infrastructure files read-only on disk.
# git does not preserve this permission across clones, so run this once
# after cloning.
set -euo pipefail
cd "$(dirname "$0")/.."

chmod 444 \
  server/src/db.ts \
  server/src/historyStore.ts \
  server/src/index.ts \
  server/src/routes/schema.ts \
  server/src/routes/history.ts \
  client/src/api.ts \
  client/src/components/SchemaBrowser.tsx \
  client/src/components/HistoryPanel.tsx \
  client/src/components/ResultsTable.tsx

echo "Locked read-only files."
