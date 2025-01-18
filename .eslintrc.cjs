module.exports = {
    root: true,
    extends: ['@nuxt/eslint-config'],
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-undef': 'off',
        'vue/multi-word-component-names' : 'off',
        'vue/no-reserved-component-names': 'off',
        'array-bracket-spacing': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 5,
            'multiline': { 'max': 1 },
        }],
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'vue/no-v-html': 'off',
    },
};
