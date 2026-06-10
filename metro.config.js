const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: exclusionList([
      /\/ios\/build\/.*/,
      /\/ios\/Pods\/.*/,
      /\/android\/build\/.*/,
      /\/android\/app\/build\/.*/,
      /\/android\/\.gradle\/.*/,
      /\/android\/\.kotlin\/.*/,
    ]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
