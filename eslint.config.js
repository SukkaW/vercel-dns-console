'use strict';

module.exports = require('eslint-config-sukka').sukka({}, {
  rules: {
    'sukka/jsx/no-template-literal': 'off',
    '@typescript-eslint/only-throw-error': 'off'
  }
});
