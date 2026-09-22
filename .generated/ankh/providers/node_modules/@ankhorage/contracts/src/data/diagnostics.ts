import type { ApiId, DataSourceId, EndpointId, OperationId } from './ids';

export type DataDiagnosticSeverity = 'error' | 'info' | 'warning';

export type DataDiagnosticCode =
  | 'ambiguous-server'
  | 'duplicate-operation-id'
  | 'invalid-config'
  | 'missing-adapter'
  | 'missing-api'
  | 'missing-credential'
  | 'missing-data-source'
  | 'missing-endpoint'
  | 'missing-operation'
  | 'missing-schema'
  | 'network-error'
  | 'parse-error'
  | 'unsupported-auth-scheme'
  | 'unsupported-schema'
  | (string & {});

export interface DataSourceDiagnostic {
  readonly code: DataDiagnosticCode;
  readonly message: string;
  readonly severity: DataDiagnosticSeverity;
  readonly apiId?: ApiId;
  readonly dataSourceId?: DataSourceId;
  readonly endpointId?: EndpointId;
  readonly operationId?: OperationId;
  readonly path?: string;
  readonly hint?: string;
}

export type DataSourceDiagnosticResult<TData> =
  | {
      readonly ok: true;
      readonly data: TData;
      readonly diagnostics?: readonly DataSourceDiagnostic[];
    }
  | {
      readonly ok: false;
      readonly diagnostics: readonly DataSourceDiagnostic[];
    };
