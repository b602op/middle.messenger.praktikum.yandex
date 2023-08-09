const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        watchFiles: path.join(__dirname, "src"),
        port: 3000,
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        historyApiFallback: true
    }
});
