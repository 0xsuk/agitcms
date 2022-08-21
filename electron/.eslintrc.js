module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  env: {
    node: true,
    browser: false,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  overrides: [
    {
      files: ["preload.js"],
      env: {
        browser: true,
      },
    },
  ],
};
