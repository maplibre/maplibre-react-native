module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  plugins: ['react', 'react-native', 'fp', 'import', 'prettier', 'jest'],
  env: {
    jest: true,
  },
  settings: {
    react: {
      version: require('./package.json').dependencies.react,
      pragma: 'React',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
    'import/ignore': ['react-native'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
  },
  globals: {
    fetch: true,
    FormData: true,
    GeoJSON: true,
    requestAnimationFrame: true,
    cancelAnimationFrame: true,
    WebSocket: true,
    __DEV__: true,
    window: true,
    document: true,
    navigator: true,
    XMLSerializer: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'prettier',
    '@react-native-community',
  ],
  rules: {
    'react/no-deprecated': 'warn',
    'react/no-string-refs': 'warn',
    'import/named': [2],
    'import/no-named-default': [0],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/exports-last': [0],
    'import/no-useless-path-segments': [2],
    camelcase: [0],
    'no-console': [0],
    'import/prefer-default-export': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'react/prop-types': [2],
    quotes: [2, 'single'],
    'eol-last': [0],
    'no-continue': [1],
    'class-methods-use-this': [0],
    'no-bitwise': [1],
    'prefer-destructuring': [1],
    'consistent-return': [0],
    'no-mixed-requires': [0],
    'no-return-assign': 0,
    'no-underscore-dangle': [0],
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-use-before-define': ['error', {functions: false}],
    'no-unused-expressions': ['error', {allowTaggedTemplates: true}],
    'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
      },
    ],
    // To-Do: Address these issues incrementally
    //'fp/no-mutating-methods': 'warn',
    //'no-warning-comments': [1],
    'no-warning-comments': 0,
    'react-native/no-inline-styles': 0,
    'jest/expect-expect': 0,
    'jest/no-disabled-tests': 0,
    'fp/no-mutating-methods': 0,
    'eslint-comments/no-unlimited-disable': 'off',
    'eslint-comments/no-unused-disable': 'off',
  },
  overrides: [
    // Match TypeScript Files
    // =================================
    {
      files: ['**/*.{ts,tsx}'],

      // Global ESLint Settings
      // =================================
      env: {
        jest: true,
        es6: true,
        browser: true,
        node: true,
      },
      globals: {
        __DEV__: true,
        element: true,
        by: true,
        waitFor: true, // detox e2e
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
        react: {
          version: 'detect', // React version. "detect" automatically picks the version you have installed.
          // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
          // default to latest and warns if missing
          // It will default to "detect" in the future
        },
      },

      // Parser Settings
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [
          './tsconfig.json',
          './example/tsconfig.json',
          './plugin/src/__tests__/tsconfig.eslint.json',
        ],
        // Lint with Type Information
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          jsx: true,
        },
        sourceType: 'module',
      },

      // Extend Other Configs
      // =================================
      extends: [
        'plugin:@typescript-eslint/recommended',
        '@react-native-community',
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
      ],
      plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
      rules: {
        // turn these one to check where all the return types are missing
        // and where arguments of functions are not typed
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': ['error'],
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'react/prop-types': 'off',

        // To-Do: Address these issues incrementally
        //'@typescript-eslint/no-use-before-define': ['warn'],
        '@typescript-eslint/no-use-before-define': 'off',
        'fp/no-mutating-methods': 'off',
        'import/order': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prefer-destructuring': 'off',
        'no-warning-comments': 'off',
        'jest/expect-expect': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
        'eslint-comments/no-unused-disable': 'off',
      },
    },
  ],
};
