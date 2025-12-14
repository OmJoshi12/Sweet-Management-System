const globals = require('globals');
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      eqeqeq: 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error'
    },
    ignores: ['node_modules/', 'coverage/']
  }
];
