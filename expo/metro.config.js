const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// The Expo app renders the regular demo's App.tsx and components from the repository root.
const projectRoot = __dirname;
const demoRoot = path.resolve(projectRoot, '..');
const escape = p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [demoRoot];
// Resolve every package from expo/node_modules: the root's React Native 0.80 must never load here.
config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules')];
config.resolver.blockList = [
  ...[].concat(config.resolver.blockList ?? []),
  ...['node_modules', 'ios', 'android', '__tests__'].map(
    dir => new RegExp(`^${escape(path.join(demoRoot, dir))}/.*`),
  ),
];
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-config') {
    return { type: 'sourceFile', filePath: path.join(projectRoot, 'shims/react-native-config.ts') };
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
