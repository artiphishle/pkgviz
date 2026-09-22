import type {
  DeploymentCredentialReference,
  DeploymentProviderResult,
  DeploymentSecretResolver,
  DeploymentStoreIdentity,
} from './deployProvider.js';

export type StoreListingTarget = 'android' | 'ios';

export type StoreListingField =
  | 'name'
  | 'summary'
  | 'description'
  | 'keywords'
  | 'promotionalText'
  | 'supportUrl'
  | 'marketingUrl'
  | 'privacyPolicyUrl'
  | 'promoVideoUrl';

export interface StoreListingLocale {
  readonly locale: string;
  readonly name: string;
  readonly summary?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly promotionalText?: string;
  readonly supportUrl?: string;
  readonly marketingUrl?: string;
  readonly privacyPolicyUrl?: string;
  readonly promoVideoUrl?: string;
}

export type StoreListingAssetMediaType = 'image/jpeg' | 'image/png';

export interface StoreListingAsset {
  readonly relativePath: string;
  readonly sha256: string;
  readonly md5: string;
  readonly size: number;
  readonly mediaType: StoreListingAssetMediaType;
}

export interface StoreListingAssetSet {
  readonly target: StoreListingTarget;
  readonly locale: string;
  readonly variant: string;
  readonly assets: readonly StoreListingAsset[];
}

export interface StoreListingRemoteAssetSet {
  readonly target: StoreListingTarget;
  readonly locale: string;
  readonly variant: string;
  readonly checksum: 'md5' | 'sha256';
  readonly hashes: readonly string[];
}

export interface StoreListingDesiredState {
  readonly revision: string;
  readonly locales: readonly StoreListingLocale[];
  readonly assetSets: readonly StoreListingAssetSet[];
}

export interface StoreListingDiagnostic {
  readonly severity: 'warning' | 'error';
  readonly code: string;
  readonly message: string;
  readonly target?: StoreListingTarget;
  readonly locale?: string;
  readonly field?: StoreListingField;
  readonly variant?: string;
}

export interface StoreListingTargetState {
  readonly target: StoreListingTarget;
  readonly locales: readonly StoreListingLocale[];
  readonly assetSets: readonly StoreListingRemoteAssetSet[];
  readonly supportedFields: readonly StoreListingField[];
  readonly diagnostics: readonly StoreListingDiagnostic[];
}

export type StoreListingPlanOperation = 'create-locale' | 'update-locale' | 'replace-assets';

export interface StoreListingPlanStep {
  readonly id: string;
  readonly target: StoreListingTarget;
  readonly operation: StoreListingPlanOperation;
  readonly locale: string;
  readonly variant?: string;
}

export interface StoreListingPlan {
  readonly status: 'no-change' | 'changes' | 'blocked';
  readonly desiredRevision: string;
  readonly currentRevision: string;
  readonly steps: readonly StoreListingPlanStep[];
  readonly diagnostics: readonly StoreListingDiagnostic[];
}

export interface StoreListingAssetReader {
  readAsync(relativePath: string): Promise<Uint8Array>;
}

export interface StoreListingAdapterContext {
  readonly identity: DeploymentStoreIdentity;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface StoreListingSyncRequest extends StoreListingAdapterContext {
  readonly desired: StoreListingDesiredState;
  readonly plan: StoreListingPlan;
  readonly assets: StoreListingAssetReader;
}

export interface DeploymentStoreListingAdapter {
  readonly target: StoreListingTarget;
  inspectAsync(
    context: StoreListingAdapterContext,
  ): Promise<DeploymentProviderResult<StoreListingTargetState>>;
  syncAsync(
    request: StoreListingSyncRequest,
  ): Promise<DeploymentProviderResult<StoreListingTargetState>>;
}
