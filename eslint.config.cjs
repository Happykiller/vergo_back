// eslint.config.cjs
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    plugins: {
      prettier,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  {
    ignores: ['dist/**', 'server.ts', 'coverage/**', 'archives/**', 'docs/**', 'images/**', 'logs/**'],
  },
];
