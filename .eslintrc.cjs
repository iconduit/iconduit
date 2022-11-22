module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:import/recommended",
    "plugin:promise/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        // allow unused args if they start with _
        argsIgnorePattern: "^_",
        // ignore rest spread siblings used to omit keys from the rest
        ignoreRestSiblings: true,
      },
    ],
    "no-constant-condition": [
      "error",
      {
        // allow while(true)
        checkLoops: false,
      },
    ],
    // handled by import/no-unresolved
    "n/no-missing-import": "off",
    // don't check for unsupported features - too much config to make this work
    "n/no-unsupported-features/es-builtins": "off",
    "n/no-unsupported-features/es-syntax": "off",
    "n/no-unsupported-features/node-builtins": "off",
  },
  overrides: [
    {
      files: ["*.spec.js", "*.spec.jsx", "*.test.js", "*.test.jsx"],
      extends: ["plugin:jest/recommended"],
      plugins: ["jest"],
      env: {
        jest: true,
      },
      rules: {
        // focused tests that make it to CI will cause a build failure
        "jest/no-focused-tests": "warn",
      },
    },
  ],
};
