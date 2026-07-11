import { base } from '@rss1102/eslint-config-tdesign';

export default [
  ...base,
  {
    ignores: ['lib/**', 'public/**', 'dist/**', 'static/**', 'site/**', '**/*/*.test.js'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      'no-unassigned-vars': 'off',
      'no-useless-assignment': 'off',
      'preserve-caught-error': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
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
    files: ['*.config.js', 'test/script/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
