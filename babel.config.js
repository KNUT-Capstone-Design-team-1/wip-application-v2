module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      '@babel/plugin-transform-class-static-block',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
            '@features': './src/features',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@styles': './src/styles',
            '@api': './src/api',
            '@store': './src/store',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@types': './src/types',
            '@layouts': './src/layouts',
          },
        },
      ],
    ],
  };
};
