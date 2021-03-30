const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackBar = require('webpackbar');

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/index.ts",
  mode: isProd ? "production" : "development",
  devServer: {
    compress: true,
    clientLogLevel: "info",
    contentBase: "./public",
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新，
    hot: true,
    host: '127.0.0.1',
    port: '8080',
    disableHostCheck: true,
    publicPath: "/",
    overlay: true,
    quiet: true,
    stats: 'errors-only',
    proxy: {
      "/api": {
        target: "http://183.239.67.12:22301",
        pathRewrite: { "^/api": "" }
      }
    }
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "awesome-typescript-loader" }],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: "app.[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new WebpackBar({
      name: '📦 That Pixi Game WEBPACK',
      color: 'green',
      profile: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    }),
    // Pixi will manage game asset loading, so we just need to copy them.
    // Webpack will not be involved in bundling.
    new CopyPlugin([{ from: "src/assets", to: "assets" }]),
    //编译提示插件
    new FriendlyErrorsWebpackPlugin(
        {
          compilationSuccessInfo: {
            messages: [`You application is running here http://localhost:8080`]
            // notes: ["Some additionnal notes to be displayed unpon successful compilation"]
          },
          onErrors: undefined,
          clearConsole: true
        }
    )
  ]
};
