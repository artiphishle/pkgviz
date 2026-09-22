import type { CustomNavigatorNode } from '../navigator';
import type { NavigatorApiStability, NavigatorRuntimePlatform } from './planning';
export interface CustomNavigatorConfigIssue {
  code: string;
  message: string;
  path?: string;
}

export interface CustomNavigatorRegistration {
  readonly id: string;
  readonly platforms: readonly NavigatorRuntimePlatform[];
  readonly stability: NavigatorApiStability;
  readonly integration: 'expo-router-standard';
  readonly router: 'stack' | 'tab';
  readonly module: string;
  readonly exportName: string;
  readonly validateConfig: (
    config: CustomNavigatorNode['config'],
  ) => readonly CustomNavigatorConfigIssue[];
}

export type CustomNavigatorRegistry = Readonly<Record<string, CustomNavigatorRegistration>> & {
  readonly [CUSTOM_NAVIGATOR_REGISTRY]: true;
};

declare const CUSTOM_NAVIGATOR_REGISTRY: unique symbol;
