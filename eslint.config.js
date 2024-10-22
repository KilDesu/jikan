import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    {
        ignores: [
            'node_modules/',
            'build/',
            'dist/',
            '.svelte-kit/',
            '.env',
            '.env.*',
            '!.env.example',
            'pnpm-lock.yaml',
            'package-lock.json',
            'yarn.lock',
            '.DS_Store',
        ],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended'
    ),
    {
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2020,
            },
            globals: {
                ...globals.browser,
                ...globals.es2017,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTypescript,
        },
        rules: {
            'no-underscore-dangle': 'off',
            indent: ['error', 4],
            curly: 'error',
            'comma-dangle': 'off',
            'object-shorthand': 'error',
            '@typescript-eslint/indent': [
                'error',
                2,
                {
                    CallExpression: {
                        arguments: 'first',
                    },
                    FunctionDeclaration: {
                        parameters: 'first',
                    },
                    FunctionExpression: {
                        parameters: 'first',
                    },
                    offsetTernaryExpressions: true,
                },
            ],
        },
    },
];
