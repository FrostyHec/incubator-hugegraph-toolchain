/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        // "eslint:recommended",
        // "plugin:react/recommended",
        // "plugin:@typescript-eslint/recommended",

        '@ecomfe/eslint-config/baidu/default', // 根据代码库ES版本选择default或es5
        '@ecomfe/eslint-config/baidu/defect', // 根据代码库ES版本选择defect或defect-es5
        '@ecomfe/eslint-config',
        '@ecomfe/eslint-config/typescript',
        '@ecomfe/eslint-config/react',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
    ],
    'rules': {
    },
};
