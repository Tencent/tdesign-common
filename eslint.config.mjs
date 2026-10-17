import { tdesign } from '@tdesign/eslint-config';

export default tdesign(
  {
    preset: 'base',
    tests: true,
    ignores: ['lib/**', 'public/**', 'dist/**', 'static/**', 'site/**', '**/*/*.test.js'],
  },
  {
    name: 'tdesign-common/overrides',
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      'no-unassigned-vars': 'off',
      'no-useless-assignment': 'off',
      'preserve-caught-error': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lodash',
              message: 'Please use lodash-es instead.',
            },
          ],
          patterns: [
            {
              group: ['js/*'],
              message: 'Importing from paths starting with "js/" is not allowed. Please use "../" instead.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'tdesign-common/legacy-disable-directives',
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    name: 'tdesign-common/tooling-overrides',
    files: ['*.config.js', 'test/script/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
