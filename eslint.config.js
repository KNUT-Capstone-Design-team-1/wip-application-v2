// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'node_modules',
      'dist/*',
      'build',
      '/.expo',
      'old_src/*',
      'tmp/*',
    ],
  },
  {
    rules: {
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'switch', 'try', 'return', 'function'],
        },
        { blankLine: 'always', prev: ['block-like', 'function'], next: '*' },
      ],
    },
  },
]);
