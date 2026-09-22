import type {
  HeadlessTabsPresentation,
  JavaScriptTabsPresentation,
  NavigatorPreset,
  NavigatorType,
  StackPresentation,
} from '../navigator';
import type { NavigatorDependencyRequirement } from './generation';
import type {
  NavigatorApiStability,
  NavigatorCapabilityId,
  NavigatorRuntimePlatform,
  NavigatorSupportStatus,
} from './planning';

export type NavigatorVerificationKind =
  | 'structural'
  | 'generation'
  | 'format'
  | 'lint'
  | 'dependency'
  | 'typescript'
  | 'install'
  | 'build'
  | 'export'
  | 'browser'
  | 'simulator'
  | 'device';

export type NavigatorVerificationStatus = 'verified' | 'unverified';

export type NavigatorImplementation = 'native' | 'javascript' | 'headless' | 'experimental';

export type NavigatorPresentation =
  | StackPresentation
  | HeadlessTabsPresentation
  | JavaScriptTabsPresentation
  | 'two-column'
  | 'three-column';

export interface NavigatorCapabilityVerification {
  kind: NavigatorVerificationKind;
  status: NavigatorVerificationStatus;
}

export interface NavigatorCapabilityTarget {
  platform: NavigatorRuntimePlatform;
  support: NavigatorSupportStatus;
  verification: readonly NavigatorCapabilityVerification[];
}

export interface NavigatorCapabilityRequirement {
  id: string;
  description: string;
}

export interface NavigatorCapabilityDescriptor {
  id: NavigatorCapabilityId;
  topology: NavigatorType;
  implementation?: NavigatorImplementation;
  presentation?: NavigatorPresentation;
  stability: NavigatorApiStability;
  targets: readonly NavigatorCapabilityTarget[];
  dependencies: readonly NavigatorDependencyRequirement[];
  requirements: readonly NavigatorCapabilityRequirement[];
  incompatibilities: readonly NavigatorCapabilityId[];
  limitations: readonly string[];
}

export interface NavigatorPresetDescriptor {
  id: NavigatorPreset;
  description: string;
  topology: readonly NavigatorType[];
}

export interface NavigatorCatalog {
  capabilities: readonly NavigatorCapabilityDescriptor[];
  presets: readonly NavigatorPresetDescriptor[];
}
