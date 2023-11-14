module.exports = function override(config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
  };

  return config;
};
