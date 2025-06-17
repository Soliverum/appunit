module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:react/recommended', // Use recommended React rules
    'plugin:@typescript-eslint/recommended', // Use recommended TypeScript rules
    'plugin:prettier/recommended', // Integrates eslint-plugin-prettier and eslint-config-prettier
  ],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable Node.js global variables
    es2021: true, // Enable ES2021 features
  },
  rules: {
    // Add any specific rules or overrides here
    // Example: 'react/react-in-jsx-scope': 'off', // Disable the rule requiring React to be in scope
  },
};