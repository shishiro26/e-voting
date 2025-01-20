import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-undef': 'error',

      'no-unused-expressions': 'warn',
      'no-redeclare': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',

      fix: ['warn'],

      semi: ['warn', 'always'],
      quotes: ['warn', 'single'],
    },
  },
];
