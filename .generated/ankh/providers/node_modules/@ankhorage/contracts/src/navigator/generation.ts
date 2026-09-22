import type {
  NavigatorCapabilityId,
  NavigatorDiagnostic,
  NavigatorPlan,
  NavigatorSupportStatus,
} from './planning';

export interface NavigatorGeneratedFile {
  path: string;
  contents: string;
}

export interface NavigatorGenerationBindings {
  screens: Readonly<Record<string, NavigatorScreenModule>>;
  guards: Readonly<Record<string, NavigatorScreenModule>>;
  iconSourceResolver?: NavigatorScreenModule;
  tabPresentations?: Readonly<Record<string, NavigatorScreenModule>>;
}

export interface NavigatorDependencyRequirement {
  packageName: string;
  versionRange: string;
  kind: 'dependency' | 'peerDependency';
}

export interface NavigatorGenerationResult {
  support: NavigatorSupportStatus;
  capabilityIds: readonly NavigatorCapabilityId[];
  dependencies: readonly NavigatorDependencyRequirement[];
  diagnostics: readonly NavigatorDiagnostic[];
  plan: NavigatorPlan;
  files: readonly NavigatorGeneratedFile[];
}

/** Options for placing Navigator-owned files inside a consumer-owned Expo Router app shell. */
export interface NavigatorGenerationOptions {
  /** Directory that receives the root navigator layout. Must be `src/app` or one of its safe descendants. */
  rootDirectory?: string;
  /** Emit routed screen re-export modules in addition to layouts. Defaults to true. */
  includeScreenFiles?: boolean;
}

export interface NavigatorScreenModule {
  module: string;
  exportName: string;
}
