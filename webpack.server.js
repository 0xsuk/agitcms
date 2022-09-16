const path = require("path");

module.exports = {
  entry: "./server/main.ts",
  //for node, supress polyfill warning
  target: "node",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js",
    libraryTarget: "commonjs", //since main.js is used by cli/index.js, it has to be commonjs
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.join(__dirname, "server"),
      "@shared": path.join(__dirname, "shared"),
    },
  },
};
