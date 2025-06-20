module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    'vue/max-attributes-per-line': [2, {
      'singleline': 10,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'accessor-pairs': 'off',
    'arrow-spacing': 'off',
    'block-spacing': 'off',
    'brace-style': 'off',
    'camelcase': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'comma-style': 'off',
    'constructor-super': 'off',
    'curly': 'off',
    'dot-location': 'off',
    'eol-last': 'off',
    'eqeqeq': 'off',
    'generator-star-spacing': 'off',
    'handle-callback-err': 'off',
    'indent': 'off',
    'jsx-quotes': 'off',
    'key-spacing': 'off',
    'keyword-spacing': 'off',
    'new-cap': 'off',
    'new-parens': 'off',
    'no-array-constructor': 'off',
    'no-caller': 'off',
    'no-console': 'off',
    'no-class-assign': 'off',
    'no-cond-assign': 'off',
    'no-const-assign': 'off',
    'no-control-regex': 'off',
    'no-delete-var': 'off',
    'no-dupe-args': 'off',
    'no-dupe-class-members': 'off',
    'no-dupe-keys': 'off',
    'no-duplicate-case': 'off',
    'no-empty-character-class': 'off',
    'no-empty-pattern': 'off',
    'no-eval': 'off',
    'no-ex-assign': 'off',
    'no-extend-native': 'off',
    'no-extra-bind': 'off',
    'no-extra-boolean-cast': 'off',
    'no-extra-parens': 'off',
    'no-fallthrough': 'off',
    'no-floating-decimal': 'off',
    'no-func-assign': 'off',
    'no-implied-eval': 'off',
    'no-inner-declarations': 'off',
    'no-invalid-regexp': 'off',
    'no-irregular-whitespace': 'off',
    'no-iterator': 'off',
    'no-label-var': 'off',
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-multi-spaces': 'off',
    'no-multi-str': 'off',
    'no-multiple-empty-lines': 'off',
    'no-native-reassign': 'off',
    'no-negated-in-lhs': 'off',
    'no-new-object': 'off',
    'no-new-require': 'off',
    'no-new-symbol': 'off',
    'no-new-wrappers': 'off',
    'no-obj-calls': 'off',
    'no-octal': 'off',
    'no-octal-escape': 'off',
    'no-path-concat': 'off',
    'no-proto': 'off',
    'no-redeclare': 'off',
    'no-regex-spaces': 'off',
    'no-return-assign': 'off',
    'no-self-assign': 'off',
    'no-self-compare': 'off',
    'no-sequences': 'off',
    'no-shadow-restricted-names': 'off',
    'no-spaced-func': 'off',
    'no-sparse-arrays': 'off',
    'no-this-before-super': 'off',
    'no-throw-literal': 'off',
    'no-trailing-spaces': 'off',
    'no-undef': 'off',
    'no-undef-init': 'off',
    'no-unexpected-multiline': 'off',
    'no-unmodified-loop-condition': 'off',
    'no-unneeded-ternary': 'off',
    'no-unreachable': 'off',
    'no-unsafe-finally': 'off',
    'no-unused-vars': 'off',
    'no-useless-call': 'off',
    'no-useless-computed-key': 'off',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'off',
    'no-whitespace-before-property': 'off',
    'no-with': 'off',
    'one-var': 'off',
    'operator-linebreak': 'off',
    'padded-blocks': 'off',
    'quotes': 'off',
    'semi': 'off',
    'semi-spacing': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'space-unary-ops': 'off',
    'spaced-comment': 'off',
    'template-curly-spacing': 'off',
    'use-isnan': 'off',
    'valid-typeof': 'off',
    'wrap-iife': 'off',
    'yield-star-spacing': 'off',
    'yoda': 'off',
    'prefer-const': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off'
  }
}
