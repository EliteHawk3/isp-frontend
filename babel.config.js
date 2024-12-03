module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Required for Reanimated
    ['@babel/plugin-transform-class-properties', { loose: true }], // Ensure loose mode consistency
    ['@babel/plugin-transform-private-methods', { loose: true }], // Ensure loose mode consistency
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Ensure loose mode consistency
  ],
};
