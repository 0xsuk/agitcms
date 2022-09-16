const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./renderer/index.tsx",
  output: {
    path: path.join(__dirname, "public", "js"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "public"),
    },
    devMiddleware: {
      publicPath: "/js/",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer/"),
    },
    //repeating renderer.tsconfig.compilerOptions.paths
    alias: {
      "@": path.join(__dirname, "renderer"),
      "@shared": path.join(__dirname, "shared"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({ React: "react", Buffer: ["buffer", "Buffer"] }),
  ],
};
