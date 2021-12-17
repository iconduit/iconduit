module.exports = {
  extends: 'standard',
  env: {
    node: true,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'no-unused-vars': 'error',
    'object-curly-spacing': ['error', 'never'],
    'padding-line-between-statements': ['error', {
      blankLine: 'always',
      prev: '*',
      next: 'return',
    }],
    'prefer-const': 'error',
    'quote-props': ['error', 'as-needed'],
    radix: 'error',
  },
}
