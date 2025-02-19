import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    {
      files: ['src/**/*.{js,ts,tsx}'],
    },
    {
      ignores: ['**/*.json', 'Measure/**/*'],
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    eslintPluginPrettierRecommended,
  ],

  languageOptions: {
    globals: {
      figma: true,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: 'module',

    parserOptions: {
      project: 'tsconfig.json',
    },
  },

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
    },
  },

  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'react/no-did-mount-set-state': 0,
    'react-hooks/exhaustive-deps': 0,

    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '^[a-zA-Z]',
            group: 'builtin',
            position: 'after',
          },
        ],

        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',

        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
});
