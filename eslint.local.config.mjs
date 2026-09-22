const legacyAnalysisRules = {
  'max-lines-per-function': 'off',
  complexity: 'off',
  'no-case-declarations': 'off',
  'security/detect-object-injection': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/prefer-destructuring': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-enum-comparison': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
};

const legacyUiRules = {
  'max-lines-per-function': 'off',
  'security/detect-object-injection': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
};

export default [
  {
    files: ['src/utils/**/*.{ts,tsx}'],
    rules: legacyAnalysisRules,
  },
  {
    files: ['src/layouts/**/*.{ts,tsx}', 'src/screens/**/*.{ts,tsx}'],
    rules: legacyUiRules,
  },
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
