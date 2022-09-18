module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
  env: {
    node: false,
    browser: true,
  },
  ignorePatterns: [".eslintrc.js"],
};
