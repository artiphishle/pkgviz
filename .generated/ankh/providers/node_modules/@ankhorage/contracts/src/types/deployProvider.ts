import type { AppDeployTargetId } from '../deploy.js';
import type { DeploymentMonetizationAdapter } from './deployMonetization.js';
import type { DeploymentReleaseAdapter } from './deployRelease.js';
import type { DeploymentStoreListingAdapter } from './deployStoreListing.js';

export const DEPLOYMENT_CAPABILITIES = [
  'provision',
  'prepare',
  'build',
  'publish',
  'verify',
] as const;

export type DeploymentCapability = (typeof DEPLOYMENT_CAPABILITIES)[number];

export const DEPLOYMENT_PROVIDER_CAPABILITY_IDS = [
  'setup',
  'web-publish',
  'android-build',
  'android-publish',
  'ios-build',
  'ios-publish',
  'store-listing',
  'monetization',
  'release',
] as const;

export type DeploymentProviderCapabilityId = (typeof DEPLOYMENT_PROVIDER_CAPABILITY_IDS)[number];

export interface DeploymentProviderCapabilityDescriptor {
  readonly id: DeploymentProviderCapabilityId;
  readonly targets: readonly AppDeployTargetId[];
}

export interface DeploymentProviderDescriptor {
  readonly id: string;
  readonly packageName: string;
  readonly displayName: string;
  readonly capabilities: readonly DeploymentProviderCapabilityDescriptor[];
}

export interface DeploymentCredentialReference {
  readonly provider: string;
  readonly id: string;
  readonly kind: string;
}

export type DeploymentSecretMaterial = string;

export type DeploymentSecretResolver = (
  reference: DeploymentCredentialReference,
) => Promise<DeploymentSecretMaterial | null>;

export interface DeploymentFailure {
  readonly code: string;
  readonly message: string;
  readonly target?: AppDeployTargetId;
  readonly provider?: string;
}

export interface DeploymentAuthenticationRequiredAction {
  readonly type: 'authentication';
  readonly provider: string;
  readonly target?: AppDeployTargetId;
  readonly code: string;
  readonly message: string;
}

export interface DeploymentManualAction {
  readonly type: 'manual-action';
  readonly target: AppDeployTargetId;
  readonly provider?: string;
  readonly code: string;
  readonly message: string;
  readonly url?: string;
}

export type DeploymentRequiredAction =
  DeploymentAuthenticationRequiredAction | DeploymentManualAction;

export type DeploymentProviderResult<T> =
  | { readonly status: 'completed'; readonly value: T }
  | { readonly status: 'action-required'; readonly action: DeploymentRequiredAction }
  | { readonly status: 'failed'; readonly failure: DeploymentFailure };

export type DeploymentAuthenticationState =
  | { readonly status: 'authenticated' }
  | {
      readonly status: 'required';
      readonly action: DeploymentAuthenticationRequiredAction;
    };

export interface DeploymentProviderCapabilityState {
  readonly capability: DeploymentCapability;
  readonly status: 'available' | 'unavailable';
  readonly reason?: string;
}

export interface DeploymentAutomatedProvisioningRequirement {
  readonly type: 'automated';
  readonly id: string;
  readonly provider: string;
  readonly target?: AppDeployTargetId;
  readonly code: string;
  readonly message: string;
}

export type DeploymentProvisioningRequirement =
  | DeploymentAutomatedProvisioningRequirement
  | { readonly type: 'authentication'; readonly action: DeploymentAuthenticationRequiredAction }
  | { readonly type: 'manual-action'; readonly action: DeploymentManualAction };

export interface DeploymentProviderSetupContext {
  readonly projectRoot: string;
  readonly target?: AppDeployTargetId;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface DeploymentProviderSetupInspection {
  readonly provider: string;
  readonly authentication: DeploymentAuthenticationState;
  readonly capabilities: readonly DeploymentProviderCapabilityState[];
  readonly provisioning: readonly DeploymentProvisioningRequirement[];
}

export interface DeploymentProviderSetupAdapter {
  readonly provider: string;
  inspectSetup(context: DeploymentProviderSetupContext): Promise<DeploymentProviderSetupInspection>;
}

export type DeploymentStoreIdentity =
  | { readonly target: 'android'; readonly packageName: string }
  | { readonly target: 'ios'; readonly bundleIdentifier: string };

export interface WebDeploymentPublishIntent {
  readonly mode: 'preview' | 'production';
  readonly alias?: string;
  readonly environment?: string;
}

export interface WebDeploymentPublication {
  readonly target: 'web';
  readonly revision: string;
  readonly provider: string;
  readonly deploymentId: string;
  readonly url: string;
  readonly production: boolean;
}

export interface WebDeploymentPublishRequest {
  readonly projectRoot: string;
  readonly exportDirectory: string;
  readonly revision: string;
  readonly intent: WebDeploymentPublishIntent;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface WebDeploymentPublisher {
  publishAsync(
    request: WebDeploymentPublishRequest,
  ): Promise<DeploymentProviderResult<WebDeploymentPublication>>;
}

export const ANDROID_DEPLOYMENT_TRACKS = ['internal', 'alpha', 'beta', 'production'] as const;
export type AndroidDeploymentTrack = (typeof ANDROID_DEPLOYMENT_TRACKS)[number];

export const ANDROID_RELEASE_STATUSES = ['draft', 'completed'] as const;
export type AndroidReleaseStatus = (typeof ANDROID_RELEASE_STATUSES)[number];

export interface AndroidDeploymentIntent {
  readonly buildProfile: string;
  readonly track: AndroidDeploymentTrack;
  readonly releaseStatus: AndroidReleaseStatus;
}

export interface AndroidBuildInspectionRequest {
  readonly projectRoot: string;
  readonly packageName: string;
  readonly buildProfile: string;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface AndroidBuildInspection {
  readonly fingerprint: string;
}

export interface AndroidBuildRequest extends AndroidBuildInspectionRequest {
  readonly expectedFingerprint: string;
}

export interface AndroidBuildArtifact {
  readonly provider: string;
  readonly buildId: string;
  readonly buildProfile: string;
  readonly fingerprint: string;
  readonly versionCode: number;
  readonly archiveUrl: string;
}

export interface AndroidDeploymentBuilder {
  inspectAsync(
    request: AndroidBuildInspectionRequest,
  ): Promise<DeploymentProviderResult<AndroidBuildInspection>>;
  buildAsync(request: AndroidBuildRequest): Promise<DeploymentProviderResult<AndroidBuildArtifact>>;
}

export interface AndroidPublishInspectionRequest {
  readonly packageName: string;
  readonly track: AndroidDeploymentTrack;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface AndroidPublishInspection {
  readonly track: AndroidDeploymentTrack;
  readonly activeVersionCodes: readonly number[];
}

export interface AndroidPublishRequest extends AndroidPublishInspectionRequest {
  readonly revision: string;
  readonly releaseStatus: AndroidReleaseStatus;
  readonly artifact: AndroidBuildArtifact;
}

export interface AndroidDeploymentPublication {
  readonly target: 'android';
  readonly revision: string;
  readonly buildProvider: string;
  readonly publishProvider: string;
  readonly buildId: string;
  readonly versionCode: number;
  readonly track: AndroidDeploymentTrack;
  readonly releaseStatus: AndroidReleaseStatus;
}

export interface AndroidDeploymentPublisher {
  inspectAsync(
    request: AndroidPublishInspectionRequest,
  ): Promise<DeploymentProviderResult<AndroidPublishInspection>>;
  publishAsync(
    request: AndroidPublishRequest,
  ): Promise<DeploymentProviderResult<AndroidDeploymentPublication>>;
  verifyAsync(
    request: AndroidPublishRequest,
  ): Promise<DeploymentProviderResult<AndroidPublishInspection>>;
}

export interface IosDeploymentIntent {
  readonly buildProfile: string;
  readonly version: string;
}

export interface IosBuildInspectionRequest {
  readonly projectRoot: string;
  readonly bundleIdentifier: string;
  readonly buildProfile: string;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface IosBuildInspection {
  readonly fingerprint: string;
}

export interface IosBuildRequest extends IosBuildInspectionRequest {
  readonly expectedFingerprint: string;
  readonly version: string;
}

export interface IosBuildArtifact {
  readonly provider: string;
  readonly buildId: string;
  readonly buildProfile: string;
  readonly fingerprint: string;
  readonly version: string;
  readonly buildNumber: string;
  readonly archiveUrl: string;
}

export interface IosDeploymentBuilder {
  inspectAsync(
    request: IosBuildInspectionRequest,
  ): Promise<DeploymentProviderResult<IosBuildInspection>>;
  buildAsync(request: IosBuildRequest): Promise<DeploymentProviderResult<IosBuildArtifact>>;
}

export interface IosPublishInspectionRequest {
  readonly bundleIdentifier: string;
  readonly version: string;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface IosPublishInspection {
  readonly bundleIdentifier: string;
  readonly version: string | null;
  readonly buildNumber: string | null;
}

export interface IosPublishRequest extends IosPublishInspectionRequest {
  readonly revision: string;
  readonly artifact: IosBuildArtifact;
}

export interface IosDeploymentPublication {
  readonly target: 'ios';
  readonly revision: string;
  readonly buildProvider: string;
  readonly publishProvider: string;
  readonly buildId: string;
  readonly version: string;
  readonly buildNumber: string;
}

export interface IosDeploymentPublisher {
  inspectAsync(
    request: IosPublishInspectionRequest,
  ): Promise<DeploymentProviderResult<IosPublishInspection>>;
  publishAsync(
    request: IosPublishRequest,
  ): Promise<DeploymentProviderResult<IosDeploymentPublication>>;
  verifyAsync(request: IosPublishRequest): Promise<DeploymentProviderResult<IosPublishInspection>>;
}

export interface DeploymentProviderRegistration {
  readonly descriptor: DeploymentProviderDescriptor;
  readonly setup?: DeploymentProviderSetupAdapter;
  readonly webPublisher?: WebDeploymentPublisher;
  readonly androidBuilder?: AndroidDeploymentBuilder;
  readonly androidPublisher?: AndroidDeploymentPublisher;
  readonly iosBuilder?: IosDeploymentBuilder;
  readonly iosPublisher?: IosDeploymentPublisher;
  readonly storeListing?: DeploymentStoreListingAdapter;
  readonly monetization?: DeploymentMonetizationAdapter;
  readonly release?: DeploymentReleaseAdapter;
}
