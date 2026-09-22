import type { ValueMap } from '../collections';
import type { SchemaId } from './ids';
import type { DataContractValue } from './values';

export type DataSchemaPrimitiveType =
  'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string';

export interface DataSchemaRef {
  readonly id: SchemaId;
}

export interface DataSchemaProperty {
  readonly description?: string;
  readonly schema: DataSchema;
}

export interface DataSchema {
  readonly type?: DataSchemaPrimitiveType | readonly DataSchemaPrimitiveType[];
  readonly title?: string;
  readonly description?: string;
  readonly enum?: readonly DataContractValue[];
  readonly const?: DataContractValue;
  readonly default?: DataContractValue;
  readonly format?: string;
  readonly nullable?: boolean;
  readonly required?: readonly string[];
  readonly properties?: ValueMap<string, DataSchema>;
  readonly additionalProperties?: boolean | DataSchema;
  readonly items?: DataSchema;
  readonly allOf?: readonly DataSchema[];
  readonly anyOf?: readonly DataSchema[];
  readonly oneOf?: readonly DataSchema[];
  readonly ref?: DataSchemaRef;
}

export type DataSchemaRegistry = ValueMap<SchemaId, DataSchema>;

export interface DataSchemaSlot {
  readonly schema?: DataSchema;
  readonly schemaRef?: DataSchemaRef;
}
