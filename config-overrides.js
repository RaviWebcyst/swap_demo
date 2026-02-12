const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),

    // 👇 IMPORTANT FIX
    process: require.resolve("process/browser.js"),
     vm: false,
  };

  config.resolve.alias = {
    ...config.resolve.alias,

    // 👇 ESM fully-specified alias
    "process/browser": require.resolve("process/browser.js")
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  );

  return config;
};
