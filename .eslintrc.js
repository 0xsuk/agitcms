module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "2020",
    emcaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
