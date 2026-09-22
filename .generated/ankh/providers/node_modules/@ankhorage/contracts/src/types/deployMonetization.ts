import type {
  DeploymentCredentialReference,
  DeploymentProviderResult,
  DeploymentSecretResolver,
  DeploymentStoreIdentity,
} from './deployProvider.js';

export type MonetizationProductKind = 'consumable' | 'non-consumable' | 'subscription';

export interface MonetizationLocalization {
  readonly locale: string;
  readonly name: string;
  readonly description: string;
}

export interface MonetizationBasePrice {
  readonly country: string;
  readonly currency: string;
  readonly amount: string;
}

export type MonetizationSubscriptionPeriod = 'P1W' | 'P1M' | 'P2M' | 'P3M' | 'P6M' | 'P1Y';

export interface MonetizationSubscription {
  readonly family: string;
  readonly period: MonetizationSubscriptionPeriod;
  readonly level?: number;
}

export interface MonetizationProduct {
  readonly id: string;
  readonly kind: MonetizationProductKind;
  readonly localizations: readonly MonetizationLocalization[];
  readonly basePrice: MonetizationBasePrice;
  readonly subscription?: MonetizationSubscription;
}

export interface MonetizationObservedProduct {
  readonly id: string;
  readonly kind: MonetizationProductKind | 'one-time';
  readonly localizations: readonly MonetizationLocalization[];
  readonly basePrice?: MonetizationBasePrice;
  readonly subscription?: MonetizationSubscription;
}

export interface MonetizationDesiredState {
  readonly revision: string;
  readonly products: readonly MonetizationProduct[];
}

export interface MonetizationDiagnostic {
  readonly severity: 'warning' | 'error';
  readonly code: string;
  readonly message: string;
  readonly target?: 'android' | 'ios';
  readonly productId?: string;
  readonly locale?: string;
}

export interface MonetizationTargetState {
  readonly target: 'android' | 'ios';
  readonly products: readonly MonetizationObservedProduct[];
  readonly subscriptionFamilies: readonly string[];
  readonly diagnostics: readonly MonetizationDiagnostic[];
}

export interface MonetizationPlanStep {
  readonly id: string;
  readonly target: 'android' | 'ios';
  readonly productId: string;
  readonly operation:
    | 'ensure-subscription-family'
    | 'create-product'
    | 'update-metadata'
    | 'update-price'
    | 'update-subscription';
}

export interface MonetizationPlan {
  readonly status: 'no-change' | 'changes' | 'blocked';
  readonly desiredRevision: string;
  readonly currentRevision: string;
  readonly steps: readonly MonetizationPlanStep[];
  readonly diagnostics: readonly MonetizationDiagnostic[];
}

export interface MonetizationAdapterContext {
  readonly identity: DeploymentStoreIdentity;
  readonly credentials: readonly DeploymentCredentialReference[];
  readonly resolveSecret: DeploymentSecretResolver;
}

export interface MonetizationSyncRequest extends MonetizationAdapterContext {
  readonly desired: MonetizationDesiredState;
  readonly plan: MonetizationPlan;
}

export interface DeploymentMonetizationAdapter {
  readonly target: 'android' | 'ios';
  inspectAsync(
    context: MonetizationAdapterContext,
  ): Promise<DeploymentProviderResult<MonetizationTargetState>>;
  syncAsync(
    request: MonetizationSyncRequest,
  ): Promise<DeploymentProviderResult<MonetizationTargetState>>;
}
