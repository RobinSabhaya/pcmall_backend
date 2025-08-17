import js from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import esLintPlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import unicornPlugin from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import optimizeRegexPlugin from 'eslint-plugin-optimize-regex';
import globals from 'globals';

export default [
  js.configs.recommended,

  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      // Dependencies
      'node_modules/**',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // Build outputs
      'dist/**',
      'build/**',
      'lib/**',
      '*.tsbuildinfo',

      // Coverage and test outputs
      'coverage/**',
      '.nyc_output/**',

      // Logs and runtime data
      'logs/**',
      '*.log',
      'pids/**',
      '*.pid',
      '*.seed',
      '*.pid.lock',

      // Cache directories
      '.npm/**',
      '.eslintcache',

      // Environment files
      '.env*',

      // IDE files
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',
      '*~',

      // OS generated files
      '.DS_Store',
      '.DS_Store?',
      '._*',
      '.Spotlight-V100',
      '.Trashes',
      'ehthumbs.db',
      'Thumbs.db',

      // Generated files
      '*.d.ts.map',
      '*.js.map',

      // Documentation
      'docs/**',
      '*.md',

      // Config files that don't need linting
      '*.config.js',
      'webpack.*.js',
      'jest.config.js',
      'prettier.config.js',

      // Database files
      '*.sqlite',
      '*.db',

      // Temporary files
      'tmp/**',
      'temp/**',

      // Generated API documentation
      'api-docs/**',

      // Docker and CI/CD files
      'Dockerfile*',
      'docker-compose*.yml',
      '.github/**',
      '.gitlab-ci.yml',
      '.travis.yml',
      '.circleci/**',

      // Package manager files
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',

      // Generated migrations
      'src/migrations/generated/**',

      // Third-party libraries
      'vendor/**',
      'public/libs/**',
    ],
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
      node: esLintPlugin,
      security: securityPlugin,
      import: importPlugin,
      promise: promisePlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
      'optimize-regex': optimizeRegexPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      node: {
        tryExtensions: ['.js', '.ts', '.json', '.node'],
      },
    },
    rules: {
      // TypeScript specific rules for scalability
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE',"snake_case"],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
      ],

      // Performance and optimization rules
      'no-await-in-loop': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'optimize-regex/optimize-regex': 'warn',

      // Import rules for better module management
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-unused-modules': 'error',
      'import/no-deprecated': 'warn',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Node.js specific optimizations
      'node/no-missing-import': 'off', // Handled by TypeScript
      'node/no-unsupported-features/es-syntax': 'off',
      'node/prefer-global/buffer': 'error',
      'node/prefer-global/console': 'error',
      'node/prefer-global/process': 'error',
      'node/prefer-promises/dns': 'error',
      'node/prefer-promises/fs': 'error',
      'node/no-sync': 'warn',

      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-unsafe-regex': 'error',

      // Code quality and maintainability
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/max-switch-cases': ['error', 30],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      // 'sonarjs/no-duplicate-string': ['error', 3],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-same-line-conditional': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/prefer-while': 'error',

      // Promise handling
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'warn',
      'promise/no-new-statics': 'error',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',

      // Unicorn rules for modern JavaScript
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      // 'unicorn/no-array-instanceof': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-hex-escape': 'error',
      'unicorn/no-keyword-prefix': 'off',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-process-exit': 'error',
      'unicorn/no-unreadable-array-destructuring': 'error',
      // 'unicorn/no-unsafe-regex': 'error',
      'unicorn/no-unused-properties': 'error',
      'unicorn/no-zero-fractions': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/numeric-separators-style': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-math-trunc': 'error',
      'unicorn/prefer-modern-dom-apis': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-reflect-apply': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-spread': 'error',
      // 'unicorn/prefer-string-ends-with': 'error',
      // 'unicorn/prefer-string-starts-with': 'error',
      // 'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-ternary': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/string-content': 'off',
      'unicorn/throw-new-error': 'error',

      // General best practices for scalability
      complexity: ['error', 10],
      'max-depth': ['error', 4],
      'max-lines': ['error', 500],
      'max-lines-per-function': ['error', 200],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 5],
      'max-statements': ['error', 20],
      // 'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-destructuring': 'error',
      'object-shorthand': 'error',
      'no-useless-concat': 'error',
      // 'no-useless-template-literals': 'error',
    },
  },

  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      node: esLintPlugin,
      security: securityPlugin,
      import: importPlugin,
      promise: promisePlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
      'optimize-regex': optimizeRegexPlugin,
    },
    rules: {
      // Similar rules as TypeScript but without TS-specific ones
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-await-in-loop': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
      'no-console': 'off',
    },
  },

  // Migration files configuration
  {
    files: ['**/migrations/**/*.ts', '**/migrations/**/*.js'],
    rules: {
      'unicorn/filename-case': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-console': 'off',
    },
  },

  // Scripts configuration
  {
    files: ['**/scripts/**/*.ts', '**/scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      'unicorn/no-process-exit': 'off',
      'node/no-process-exit': 'off',
    },
  },

  // Configuration files
  {
    files: ['*.config.ts', '*.config.js', '*.config.mjs'],
    rules: {
      'unicorn/prefer-module': 'off',
      'import/no-default-export': 'off',
    },
  },
];
