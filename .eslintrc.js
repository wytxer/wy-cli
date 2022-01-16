module.exports = {
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: false,
    node: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {},
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    useJSXTextNode: true,
    project: 'tsconfig.json'
  }
}
