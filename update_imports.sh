#!/bin/bash

FILES=$(find test -name "*.spec.ts*")

for f in $FILES
do
  IMPORTS=$(grep -E "from 'node:test'|from 'node:path'|from '@artiphishle/testosterone/src/matchers'" "$f" | \
    sed -e 's/import { \(.*\) } from .*/\1/' | \
    tr -d ' ' | \
    tr ',' '\n' | \
    sort -u | \
    tr '\n' ', ' | \
    sed 's/, $//')

  if [ -n "$IMPORTS" ]; then
    NEW_IMPORT="import { $IMPORTS } from '@artiphishle/testosterone';"
    TMP_FILE=$(mktemp)
    echo "$NEW_IMPORT" > "$TMP_FILE"
    grep -v -E "from 'node:test'|from 'node:path'|from '@artiphishle/testosterone/src/matchers'" "$f" >> "$TMP_FILE"
    mv "$TMP_FILE" "$f"
    echo "Updated imports in $f"
  else
    echo "No relevant imports to update in $f"
  fi
done
