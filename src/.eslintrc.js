module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["prettier"],
  env: {
    node: false,
    browser: true,
    es6: true,
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "off",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    emcaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [".eslintrc.js"],
};
