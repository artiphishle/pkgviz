import { describe, expect, it } from 'bun:test';

import type { DatabaseDataSourceConfig, DataSourceConfig, DataSourceDiagnostic } from './index';

function assertSerializable<TValue>(value: TValue): void {
  expect(JSON.parse(JSON.stringify(value))).toEqual(value);
}

describe('data source contracts', () => {
  it('keeps database sources separate from canonical APIs', () => {
    const source: DatabaseDataSourceConfig = {
      id: 'primary-db',
      kind: 'database',
      adapter: { id: 'supabase-db', kind: 'database' },
      endpoints: {},
    };

    assertSerializable(source);
    expect(source.kind).toBe('database');
    expect('origin' in source).toBe(false);
    expect('protocol' in source).toBe(false);
  });

  it('keeps the data-source union database-specific', () => {
    const source: DataSourceConfig = {
      id: 'primary-db',
      kind: 'database',
      adapter: { id: 'database-adapter', kind: 'database' },
      endpoints: {},
    };

    assertSerializable(source);
    expect(source.adapter.kind).toBe('database');
  });

  it('supports API identity on shared data diagnostics', () => {
    const diagnostic: DataSourceDiagnostic = {
      code: 'missing-operation',
      severity: 'error',
      message: 'Operation not found.',
      apiId: 'nutrition',
      endpointId: 'products',
      operationId: 'products.list',
    };

    assertSerializable(diagnostic);
    expect(diagnostic.apiId).toBe('nutrition');
  });
});
