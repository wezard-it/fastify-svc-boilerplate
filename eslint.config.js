import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
                ecmaVersion: 2022
            }
        },
        plugins: {
            '@typescript-eslint': typescript
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-use-before-define': 'warn',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-misused-promises': 'warn',
            '@typescript-eslint/return-await': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
                },
                {
                    selector: 'function',
                    format: ['camelCase', 'PascalCase']
                },
                {
                    selector: 'parameter',
                    format: ['camelCase', 'snake_case'],
                    leadingUnderscore: 'allow'
                },
                {
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require'
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase']
                },
                {
                    selector: 'property',
                    format: null
                },
                {
                    selector: 'objectLiteralProperty',
                    format: null
                }
            ],

            // General rules
            'no-console': 'warn',
            'prefer-const': 'warn',
            'no-var': 'error',
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'no-unreachable': 'warn'
        }
    },
    {
        files: ['wezard-scripts/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'script',
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly'
            }
        },
        rules: {
            'no-console': 'off'
        }
    },
    {
        ignores: ['dist/**', 'generated/**', 'node_modules/**']
    }
]
