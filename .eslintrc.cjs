/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "no-unused-vars": "warn",
    "prefer-const": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "no-case-declarations": "warn",
    "@typescript-eslint/consistent-type-definitions": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/array-type": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/no-unsafe-enum-comparison": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "off", // Checks rules of Hooks
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db"],
      },
    ],
  },
};
module.exports = config;
