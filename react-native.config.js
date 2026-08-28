module.exports = {
  dependencies: {
    // Disable Flipper on iOS CI builds if needed
    ...(process.env.NO_FLIPPER === '1' || process.env.CI === 'true'
      ? { 'react-native-flipper': { platforms: { ios: null } } }
      : {}),
  },
  project: {
    ios: {
      sourceDir: './ios',
    },
    android: {
      sourceDir: './android',
    },
  },
};
