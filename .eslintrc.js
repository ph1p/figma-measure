module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  globals: {
    figma: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['import', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
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
  ignorePatterns: ['*.json'],
};
