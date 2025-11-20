'use strict';

module.exports = require('eslint-config-sukka').sukka({
  node: {
    files: ['next.config.js', 'eslint.config.js']
  }
}, {
  rules: {
    'sukka/jsx/no-template-literal': 'off',
    '@typescript-eslint/only-throw-error': 'off'
  }
});
