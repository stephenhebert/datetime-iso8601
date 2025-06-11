import jsLint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tsLint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['dist/*'],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    plugins: { js: jsLint },
    extends: [
      'js/recommended',
    ],
  },
  {
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: { globals: globals.browser },
  },
  tsLint.configs.recommended,
  tsLint.configs.stylistic,
  stylistic.configs['disable-legacy'],
  stylistic.configs.customize({
    'indent': 2,
    'quotes': 'single',
    'semi': false,
    'noTrailingSpaces': 'error',
    'array-bracket-newline': 'always',
    'commaDangle': 'always-multiline',
    'emptyLinesAroundBlocks': 'always',
  }),
  {
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    rules: {
      'array-element-newline': [
        'error',
        'always',
      ],
      'object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error',
        { max: 1, maxEOF: 1, maxBOF: 0 },
      ],
    },
  },
])
