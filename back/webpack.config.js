const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/dist",
    libraryTarget: "commonjs"
  },

  target: "node",

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    minimize: true,
    minimizer: [new TerserPlugin()]
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};
