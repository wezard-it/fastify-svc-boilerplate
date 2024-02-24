module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname
    },
    plugins: ['@typescript-eslint'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        'prettier'
    ],
    env: {
        node: true,
        browser: true,
        serviceworker: true
    },
    ignorePatterns: ['dist', 'generated', '*.js', '*.config.js', 'node_modules', 'utils'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        'import/no-extraneous-dependencies': ['error'],
        'import/no-self-import': 'error',
        'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
        'import/prefer-default-export': 'off',
        'no-promise-executor-return': 'off',
        'no-underscore-dangle': ['error', { allow: ['_id', '_json', '_count'] }]
    }
}
