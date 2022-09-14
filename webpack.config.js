const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.join(__dirname, "build", "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "public"),
    },
    devMiddleware: {
      publicPath: "/dist/",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      components: path.join(__dirname, "src/components"),
      utils: path.join(__dirname, "src/utils"),
      context: path.join(__dirname, "src/context"),
      styles: path.join(__dirname, "src/styles"),
    },
    fallback: {
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({ React: "react", Buffer: ["buffer", "Buffer"] }),
  ],
};
