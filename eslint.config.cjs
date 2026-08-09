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
      // Conventions usuelles : un `_` en tête marque un paramètre/variable
      // volontairement inutilisé, un binding de `catch` non lu est toléré, et
      // le retrait d'une clé par `const { _id, ...rest }` ne compte pas _id.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  {
    // `require()` est ici l'outil juste, pas une négligence : chargement de
    // config selon NODE_ENV, dotenv appelé au bon moment, et rechargement d'un
    // module sous mock dans les specs. Import statique impossible ou incorrect.
    files: ['src/main.ts', 'src/config/**/*.ts', '**/*.spec.ts', '**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    ignores: ['dist/**', 'server.ts', 'coverage/**', 'archives/**', 'docs/**', 'images/**', 'logs/**'],
  },
];
