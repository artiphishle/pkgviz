export type DbRecord = Record<string, unknown>;

export interface DbAdapterError {
  readonly code: string;
  readonly message: string;
  readonly cause?: unknown;
}

export type DbSuccess<TData = void> = [TData] extends [void]
  ? {
      readonly ok: true;
    }
  : {
      readonly ok: true;
      readonly data: TData;
    };

export type DbResult<TData = void> =
  | DbSuccess<TData>
  | {
      readonly ok: false;
      readonly error: DbAdapterError;
    };

export type DbSortDirection = 'asc' | 'desc';

export interface DbSort {
  readonly field: string;
  readonly direction?: DbSortDirection;
}

export interface DbPage {
  readonly limit?: number;
  readonly offset?: number;
}

export type DbFilterOperator =
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'startsWith' | 'endsWith';

export interface DbFilter {
  readonly field: string;
  readonly operator: DbFilterOperator;
  readonly value: unknown;
}

export interface DbTableInput {
  readonly table: string;
  readonly schema?: string;
}

export interface DbSelectInput extends DbTableInput {
  readonly columns?: readonly string[];
  readonly filters?: readonly DbFilter[];
  readonly sort?: readonly DbSort[];
  readonly page?: DbPage;
}

export interface DbFindByIdInput extends DbTableInput {
  readonly id: string | number;
  readonly idField?: string;
  readonly columns?: readonly string[];
}

export interface DbInsertInput<TRecord extends object = DbRecord> extends DbTableInput {
  readonly values: TRecord | readonly TRecord[];
}

export interface DbUpdateInput<TRecord extends object = DbRecord> extends DbTableInput {
  readonly values: Partial<TRecord>;
  readonly filters: readonly DbFilter[];
}

export interface DbDeleteInput extends DbTableInput {
  readonly filters: readonly DbFilter[];
}

export interface DbAdapterCapabilities {
  readonly transactions: boolean;
  readonly returning: boolean;
  readonly realtime: boolean;
}

export interface DbAdapter {
  readonly capabilities: DbAdapterCapabilities;

  select<TRecord extends object = DbRecord>(input: DbSelectInput): Promise<DbResult<TRecord[]>>;
  findById<TRecord extends object = DbRecord>(
    input: DbFindByIdInput,
  ): Promise<DbResult<TRecord | null>>;
  insert<TRecord extends object = DbRecord>(
    input: DbInsertInput<TRecord>,
  ): Promise<DbResult<TRecord[]>>;
  update<TRecord extends object = DbRecord>(
    input: DbUpdateInput<TRecord>,
  ): Promise<DbResult<TRecord[]>>;
  delete<TRecord extends object = DbRecord>(input: DbDeleteInput): Promise<DbResult<TRecord[]>>;

  transaction?<TResult>(run: (adapter: DbAdapter) => Promise<TResult>): Promise<DbResult<TResult>>;
}

export type DbChangeKind = 'insert' | 'update' | 'delete';

export interface DbChangeEvent<TRecord extends object = DbRecord> {
  readonly table: string;
  readonly schema?: string;
  readonly kind: DbChangeKind;
  readonly record: TRecord | null;
  readonly previousRecord?: TRecord;
  readonly committedAt?: string;
}

export type DbChangeListener<TRecord extends object = DbRecord> = (
  event: DbChangeEvent<TRecord>,
) => void;

export interface DbSubscription {
  unsubscribe(): Promise<void> | void;
}

export type DbCollectionSubscriptionInput = DbTableInput;

export interface DbRecordSubscriptionInput extends DbCollectionSubscriptionInput {
  readonly id: string | number;
  readonly idField?: string;
}

export interface DbRealtimeAdapter {
  readonly realtime: {
    subscribeToCollection<TRecord extends object = DbRecord>(
      input: DbCollectionSubscriptionInput,
      listener: DbChangeListener<TRecord>,
    ): DbSubscription;
    subscribeToRecord<TRecord extends object = DbRecord>(
      input: DbRecordSubscriptionInput,
      listener: DbChangeListener<TRecord>,
    ): DbSubscription;
  };
}

export type DbFieldType = 'text' | 'number' | 'boolean' | 'datetime' | 'json' | 'uuid';

export interface DbFieldDefinition {
  readonly name: string;
  readonly type: DbFieldType;
  readonly required?: boolean;
  readonly unique?: boolean;
  readonly defaultValue?: string | number | boolean | null;
}

export interface DbCollectionDefinition {
  readonly name: string;
  readonly schema?: string;
  readonly fields: readonly DbFieldDefinition[];
  readonly primaryKey?: string;
}

export interface DbCollectionReference {
  readonly name: string;
  readonly schema?: string;
}

export type DbAdminResult =
  | {
      readonly ok: true;
      readonly executed: boolean;
      readonly sql?: string;
    }
  | {
      readonly ok: false;
      readonly error: DbAdapterError;
    };

export interface DbAdminAdapterCapabilities {
  readonly schemaGeneration: boolean;
  readonly directExecution: boolean;
}

export interface DbAdminAdapter {
  readonly capabilities: DbAdminAdapterCapabilities;

  createCollection(input: DbCollectionDefinition): Promise<DbAdminResult>;
  deleteCollection(input: DbCollectionReference): Promise<DbAdminResult>;
  generateCreateCollectionSql(input: DbCollectionDefinition): DbAdminResult;
  generateDeleteCollectionSql(input: DbCollectionReference): DbAdminResult;
}
