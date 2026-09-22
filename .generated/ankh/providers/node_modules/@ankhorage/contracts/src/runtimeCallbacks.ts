import type { UiNode } from './types';

export interface RuntimeResolveNodePropsArgs {
  readonly node: UiNode;
  readonly props: Record<string, unknown>;
}

export type RuntimeNodePropsResolver = (
  args: RuntimeResolveNodePropsArgs,
) => Record<string, unknown>;

export interface RuntimeCallbackArgs {
  readonly payload: unknown;
  readonly node?: UiNode;
  readonly resolvedPayload?: object;
}

export type RuntimeCallback = (args: RuntimeCallbackArgs) => Promise<void> | void;
export type RuntimeCallbackMap = Readonly<Record<string, RuntimeCallback>>;
