module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  env: {
    node: true,
    browser: false,
  },
};
