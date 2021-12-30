module.exports = {
  root: true,
  extends: ['@react-native-community', 'eslint:recommended', 'prettier'],
  plugins: [],
  parserOptions: {
    ecmaVersions: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
};
