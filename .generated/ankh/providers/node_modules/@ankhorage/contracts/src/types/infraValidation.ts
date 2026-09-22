/** Every canonical field must have a validator, including explicitly optional fields. */
export type InfraShape<T> = { readonly [K in keyof T]-?: (value: unknown) => boolean };
