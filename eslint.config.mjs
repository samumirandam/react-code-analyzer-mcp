import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import testingLibrary from 'eslint-plugin-testing-library';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    prettier: prettierPlugin,
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    'jsx-a11y': jsxA11y,
    'testing-library': testingLibrary,
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      project: './tsconfig.json',
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Prevenir errores comunes
    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
    'no-debugger': 'warn',
    'no-alert': 'warn',

    // Mejores prácticas
    eqeqeq: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'warn',

    // TypeScript específico
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

    // Estilo y formato
    quotes: ['warn', 'single', { avoidEscape: true }],
    semi: ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'arrow-body-style': ['warn', 'as-needed'],

    // TypeScript adicional
    '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
    ],

    // Reglas de importación
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'import/no-cycle': 'warn',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    'prettier/prettier': 'warn',
  },
  ignores: ['node_modules', 'build', 'dist'],
});
