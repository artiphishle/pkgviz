import type {
  DeploymentCredentialReference,
  DeploymentProviderResult,
  DeploymentSecretResolver,
  DeploymentStoreIdentity,
} from './deployProvider.js';

export type ReleaseTarget = 'web' | 'android' | 'ios';
export type ReleaseRolloutMode = 'immediate' | 'staged';

export interface ReleaseNote {
  readonly locale: string;
  readonly text: string;
}

export interface ReleaseTargetRollout {
  readonly mode: ReleaseRolloutMode;
  readonly initialFraction?: string;
}

export interface ReleaseRollout {
  readonly web?: ReleaseTargetRollout;
  readonly android?: ReleaseTargetRollout;
  readonly ios?: ReleaseTargetRollout;
}

export interface ReleaseDesiredState {
  readonly version: string;
  readonly targets: readonly ReleaseTarget[];
  readonly notes: readonly ReleaseNote[];
  readonly rollout: ReleaseRollout;
  readonly revision: string;
}

export interface ReleaseObservedWebState {
  readonly target: 'web';
  readonly version: string | null;
  readonly artifactRevision: string | null;
}

export interface ReleaseObservedAndroidState {
  readonly target: 'android';
  readonly version: string | null;
  readonly artifactRevision: string | null;
  readonly versionCodes: readonly string[];
  readonly releaseNotes: readonly ReleaseNote[];
  readonly rolloutStatus: 'missing' | 'draft' | 'inProgress' | 'halted' | 'completed';
  readonly userFraction?: string;
}

export interface ReleaseObservedIosState {
  readonly target: 'ios';
  readonly version: string | null;
  readonly artifactRevision: string | null;
  readonly buildNumber: string | null;
  readonly releaseNotes: readonly ReleaseNote[];
  readonly appVersionState?: string;
  readonly releaseType?: string;
  readonly reviewState?: string;
  readonly phasedReleaseState: 'INACTIVE' | 'ACTIVE' | 'PAUSED' | 'COMPLETE' | null;
}

export type ReleaseObservedTargetState =
  ReleaseObservedWebState | ReleaseObservedAndroidState | ReleaseObservedIosState;

export interface ReleaseObservedState {
  readonly targets: readonly ReleaseObservedTargetState[];
}

export type ReleasePlanStatus = 'no-change' | 'changes' | 'waiting' | 'blocked';
export type ReleaseStepRetry = 'safe' | 'reinspect' | 'never';
export type ReleaseStepOperation =
  | 'prepare'
  | 'build'
  | 'publish'
  | 'sync-notes'
  | 'submit-review'
  | 'release'
  | 'rollout'
  | 'verify'
  | 'record';

export interface ReleaseDiagnostic {
  readonly severity: 'warning' | 'error';
  readonly code: string;
  readonly message: string;
  readonly target?: ReleaseTarget | 'release';
}

export interface ReleasePlanStep {
  readonly id: string;
  readonly target: ReleaseTarget | 'release';
  readonly operation: ReleaseStepOperation;
  readonly dependsOn: readonly string[];
  readonly retry: ReleaseStepRetry;
  readonly irreversible: boolean;
}

export interface ReleasePlan {
  readonly status: ReleasePlanStatus;
  readonly desiredRevision: string;
  readonly currentRevision: string;
  readonly steps: readonly ReleasePlanStep[];
  readonly diagnostics: readonly ReleaseDiagnostic[];
}

export type ReleaseLifecycleControl =
  | { readonly target: 'android'; readonly action: 'halt' | 'resume' }
  | {
      readonly target: 'ios';
      readonly action: 'pause-phased' | 'resume-phased' | 'cancel-phased' | 'cancel-review';
    };

export type ReleaseMutationResult =
  | { readonly status: 'completed' }
  | { readonly status: 'blocked'; readonly code: string }
  | { readonly status: 'failed'; readonly code: string };

export type ReleaseControlExecutionResult =
  | { readonly status: 'completed'; readonly mutationAttempted: boolean }
  | { readonly status: 'blocked'; readonly mutationAttempted: false; readonly code: string }
  | { readonly status: 'failed'; readonly mutationAttempted: boolean; readonly code: string };

export interface ReleaseAdapterContext {
  readonly identity: DeploymentStoreIdentity;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface ReleaseInspectionRequest extends ReleaseAdapterContext {
  readonly version: string;
}

export interface ReleaseStepExecutionRequest extends ReleaseAdapterContext {
  readonly desired: ReleaseDesiredState;
  readonly step: ReleasePlanStep;
}

export interface ReleaseControlRequest extends ReleaseAdapterContext {
  readonly desired: ReleaseDesiredState;
  readonly control: ReleaseLifecycleControl;
}

export type ReleaseObservedNativeState = ReleaseObservedAndroidState | ReleaseObservedIosState;

export interface DeploymentReleaseAdapter {
  readonly target: 'android' | 'ios';
  inspectAsync(
    request: ReleaseInspectionRequest,
  ): Promise<DeploymentProviderResult<ReleaseObservedNativeState>>;
  executeStepAsync(request: ReleaseStepExecutionRequest): Promise<ReleaseMutationResult>;
  controlAsync(request: ReleaseControlRequest): Promise<ReleaseControlExecutionResult>;
}
