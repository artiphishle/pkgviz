/** Logical application environments shared by infrastructure and application shipment. */
export const APP_ENVIRONMENT_IDS = ['local', 'preview', 'production'] as const;

export type AppEnvironmentId = (typeof APP_ENVIRONMENT_IDS)[number];
