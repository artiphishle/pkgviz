export default [
  {
    files: ['src/app/actions/audit.actions.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['src/i18n/i18n.ts'],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
];
