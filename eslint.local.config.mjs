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
    files: ['src/app/utils/**/*.{ts,tsx}', 'src/utils/**/*.{ts,tsx}'],
    rules: legacyAnalysisRules,
  },
  {
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/layouts/**/*.{ts,tsx}',
      'src/screens/**/*.{ts,tsx}',
    ],
    rules: legacyUiRules,
  },
  {
    files: ['src/app/actions/audit.actions.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['src/shared/utils/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  {
    files: ['src/i18n/i18n.ts'],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['src/components/ThemeToggle.tsx', 'src/components/ZoomInput.tsx'],
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
