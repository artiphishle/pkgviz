import { createKnipConfig } from '@ankhorage/devtools/knip';

export default createKnipConfig({
  entry: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'eslint.examples.config.mjs',
    'eslint.local.config.mjs',
    'prettier.local.config.js',
    'test/**/*.spec.{ts,tsx}',
  ],
  ignoreFiles: ['examples/**'],
  ignoreBinaries: ['rundll32.exe', 'xdg-open'],
});
