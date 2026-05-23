// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      'supabase/.branches/**',
      'supabase/.temp/**',
    ],
  },
  js.configs.recommended,
  // Type-aware lint + import-order enforcement scoped to packages/**.
  // Apps register @typescript-eslint AND import via their framework
  // configs (eslint-config-next, eslint-config-expo) and would conflict
  // if root also registered these plugins globally. Framework presets
  // also provide their own appropriate import-order conventions.
  {
    files: ['packages/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    plugins: {
      unicorn,
    },
    rules: {
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
    },
  },
);
