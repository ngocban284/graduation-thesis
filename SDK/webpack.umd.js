const path = require("path");

module.exports = {
  mode: "production", // hoặc "development" tùy thuộc vào môi trường
  entry: "./index.ts",
  target: "node",
  output: {
    library: "mixer-helper-sdk",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "umd"),
    filename: "index.js",
    globalObject: "this",
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-typescript",
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: "current",
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  externals: [], // Thêm vào danh sách external nếu cần
  resolve: {
    extensions: [".ts", ".js"],
  },
  // Thêm cấu hình source map để dễ dàng debug
  devtool: "source-map",
};
