const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    popup: "./src/popup/index.tsx",
    background: "./src/background/background.ts",
    devtools: "./src/pages/Devtools.tsx",
    panel: "./src/pages/Panel.tsx",
    content: "./src/content/content.ts"  

  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true  // ✅ Automatically removes old files
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },

  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/manifest.json", to: "manifest.json" },
        { from: "public/icons", to: "icons" }
      ]
    }),
    new HtmlWebpackPlugin({
      template: "public/template.html",
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: "public/template.html",
      filename: "options.html",
      chunks: ["options"]
    }),
    new HtmlWebpackPlugin({
      template: "public/template.html",
      filename: "panel.html",
      chunks: ["panel"]
    }),
    new HtmlWebpackPlugin({
      template: "public/template.html",
      filename: "devtools.html",
      chunks: ["devtools"]
    })
  ]
};
