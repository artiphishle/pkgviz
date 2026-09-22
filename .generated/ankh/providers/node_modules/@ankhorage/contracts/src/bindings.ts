import type { EntityRegistry, ValueMap } from './collections';
import type { ApiId, EndpointId, OperationId } from './data';
import type { SerializableValue } from './serializable';

export type ComponentInstanceId = string;
export type ComponentTypeId = string;

export type BindingValue = SerializableValue;

export type BindingDataPath = string;

export type BindingValueTransform = 'lowercase' | 'trim' | 'uppercase';

export interface BindingOperationRef {
  readonly apiId: ApiId;
  readonly operationId: OperationId;
  readonly endpointId?: EndpointId;
}

export type BindingValueSource =
  | {
      readonly kind: 'context';
      readonly path: BindingDataPath;
    }
  | {
      readonly kind: 'event';
      readonly path: BindingDataPath;
    }
  | {
      readonly kind: 'literal';
      readonly value: BindingValue;
    }
  | {
      readonly kind: 'operation';
      readonly operation: BindingOperationRef;
      readonly path?: BindingDataPath;
    }
  | {
      readonly kind: 'state';
      readonly path: BindingDataPath;
    };

export interface BindingValueExpression {
  readonly source: BindingValueSource;
  readonly transforms?: readonly BindingValueTransform[];
}

export interface BindingFallback {
  readonly value?: BindingValue;
  readonly source?: BindingValueSource;
}

export type BindingLifecycleState = 'empty' | 'error' | 'loading';

export interface BindingLifecycleBehavior {
  readonly state: BindingLifecycleState;
  readonly fallback?: BindingFallback;
  readonly message?: string;
}

export interface PropBinding {
  readonly source: BindingValueSource;
  readonly fallback?: BindingFallback;
  readonly loading?: BindingLifecycleBehavior;
  readonly error?: BindingLifecycleBehavior;
  readonly empty?: BindingLifecycleBehavior;
  readonly transforms?: readonly BindingValueTransform[];
}

export type BindingInputValue =
  | {
      readonly kind: 'array';
      readonly items: readonly BindingInputValue[];
    }
  | {
      readonly kind: 'literal';
      readonly value: BindingValue;
    }
  | {
      readonly kind: 'object';
      readonly fields: ValueMap<string, BindingInputValue>;
    }
  | {
      readonly kind: 'source';
      readonly source: BindingValueSource;
      readonly transforms?: readonly BindingValueTransform[];
    };

export type BindingInputMap = ValueMap<string, BindingInputValue>;

export interface OperationScreenDataLoaderDefinition {
  readonly kind: 'operation';
  readonly id?: string;
  readonly operation: BindingOperationRef;
  readonly input?: BindingInputMap;
}

export type ScreenDataLoaderDefinition = OperationScreenDataLoaderDefinition;

export type BindingConditionOperator = 'eq' | 'exists' | 'neq' | 'notExists';

export interface BindingCondition {
  readonly source: BindingValueSource;
  readonly operator: BindingConditionOperator;
  readonly value?: BindingValue;
}

export type EventBindingTarget =
  | {
      readonly kind: 'action';
      readonly type: string;
    }
  | {
      readonly kind: 'operation';
      readonly operation: BindingOperationRef;
    };

export interface EventBinding {
  readonly target: EventBindingTarget;
  readonly input?: BindingInputMap;
  readonly when?: BindingCondition;
}

export interface ComponentDataBinding {
  readonly componentId: ComponentInstanceId;
  readonly componentType?: ComponentTypeId;
  readonly props?: ValueMap<string, PropBinding>;
  readonly events?: ValueMap<string, readonly EventBinding[]>;
}

export type ComponentDataBindingRegistry = EntityRegistry<
  ComponentInstanceId,
  ComponentDataBinding,
  'componentId'
>;
