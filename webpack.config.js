module.exports = {
  entry: "./lib/mimic.js",
  output: {
    path: __dirname,
    filename: "./lib/bundle.js"
  },
  devtool: "source-map"
};
