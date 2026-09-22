export const SECRET_STORE_PROVIDERS = ['supabase-vault'] as const;
export type KnownSecretStoreProvider = (typeof SECRET_STORE_PROVIDERS)[number];
export type SecretStoreProvider = KnownSecretStoreProvider | (string & {});

export type SecretRef = string;

export interface SecretScope {
  projectId: string;
  environment: string;
}

export type SecretPayload = Readonly<Record<string, string>>;

export interface SecretMetadata {
  ref: SecretRef;
  scope: SecretScope;
  kind: string;
  provider?: string;
  configuredFields: readonly string[];
  createdAt: string;
  updatedAt: string;
}

export const SECRET_STORE_ERROR_CODES = [
  'invalid_config',
  'invalid_reference',
  'invalid_payload',
  'not_found',
  'conflict',
  'permission_denied',
  'unavailable',
  'provider_error',
] as const;
export type SecretStoreErrorCode = (typeof SECRET_STORE_ERROR_CODES)[number];

export interface SecretStoreError {
  code: SecretStoreErrorCode;
  message: string;
  cause?: unknown;
}

export type SecretStoreOkResult<TData> = [TData] extends [void]
  ? { ok: true; data?: undefined }
  : { ok: true; data: TData };

export type SecretStoreResult<TData = void> =
  | SecretStoreOkResult<TData>
  | {
      ok: false;
      error: SecretStoreError;
    };

export interface SecretListInput {
  scope: SecretScope;
  kind?: string;
  provider?: string;
}

export interface SecretGetMetadataInput {
  scope: SecretScope;
  ref: SecretRef;
}

export interface SecretCreateInput {
  scope: SecretScope;
  ref: SecretRef;
  kind: string;
  provider?: string;
  payload: SecretPayload;
}

export interface SecretReplaceInput {
  scope: SecretScope;
  ref: SecretRef;
  payload: SecretPayload;
}

export interface SecretRemoveInput {
  scope: SecretScope;
  ref: SecretRef;
}

export interface SecretResolveInput {
  scope: SecretScope;
  ref: SecretRef;
}

/**
 * Provider-neutral server-side secret-store boundary.
 *
 * `resolve` is for trusted server/deployment code only. Browser bridges must expose
 * metadata operations without forwarding raw secret payloads.
 */
export interface SecretStoreAdapter {
  list(input: SecretListInput): Promise<SecretStoreResult<readonly SecretMetadata[]>>;
  getMetadata(input: SecretGetMetadataInput): Promise<SecretStoreResult<SecretMetadata>>;
  create(input: SecretCreateInput): Promise<SecretStoreResult<SecretMetadata>>;
  replace(input: SecretReplaceInput): Promise<SecretStoreResult<SecretMetadata>>;
  remove(input: SecretRemoveInput): Promise<SecretStoreResult>;
  resolve(input: SecretResolveInput): Promise<SecretStoreResult<SecretPayload>>;
}

const SECRET_REF_SEGMENT_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

export function normalizeSecretRef(value: string): SecretStoreResult<SecretRef> {
  const normalized = value
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/{2,}/g, '/');

  if (
    normalized.length === 0 ||
    normalized.length > 255 ||
    normalized.split('/').some((segment) => !SECRET_REF_SEGMENT_PATTERN.test(segment))
  ) {
    return {
      ok: false,
      error: {
        code: 'invalid_reference',
        message:
          'Secret reference must contain lowercase path segments using letters, numbers, dots, underscores, or hyphens.',
      },
    };
  }

  return { ok: true, data: normalized };
}

export function normalizeSecretScope(scope: SecretScope): SecretStoreResult<SecretScope> {
  const projectId = scope.projectId.trim();
  const environment = scope.environment.trim();

  if (projectId.length === 0 || environment.length === 0) {
    return {
      ok: false,
      error: {
        code: 'invalid_config',
        message: 'Secret scope requires non-empty projectId and environment values.',
      },
    };
  }

  return { ok: true, data: { projectId, environment } };
}

export function validateSecretPayload(payload: SecretPayload): SecretStoreResult<SecretPayload> {
  const entries = Object.entries(payload);

  if (entries.length === 0) {
    return {
      ok: false,
      error: {
        code: 'invalid_payload',
        message: 'Secret payload must contain at least one field.',
      },
    };
  }

  for (const [field, value] of entries) {
    if (field.trim().length === 0 || typeof value !== 'string' || value.length === 0) {
      return {
        ok: false,
        error: {
          code: 'invalid_payload',
          message: `Secret payload field ${field.trim().length === 0 ? '<empty>' : field} must contain a non-empty string value.`,
        },
      };
    }
  }

  return { ok: true, data: Object.freeze(Object.fromEntries(entries)) };
}

export const FORBIDDEN_INLINE_SECRET_FIELDS = [
  'apiKey',
  'clientSecret',
  'databasePassword',
  'privateKey',
  'serviceRoleKey',
  'token',
] as const;

export function findForbiddenInlineSecretFields(value: unknown): readonly string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [];

  const record = value as Record<string, unknown>;
  return FORBIDDEN_INLINE_SECRET_FIELDS.filter((field) => field in record);
}
