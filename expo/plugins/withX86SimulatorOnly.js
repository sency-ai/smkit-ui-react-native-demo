const { withPodfile, withXcodeProject } = require('expo/config-plugins');

// SMBase, SMKit and SMKitUI 2.7.3 ship only an x86_64 simulator slice, so
// simulator builds must skip arm64 in both the app and its pods. Device
// builds are unaffected.
const SETTING = 'EXCLUDED_ARCHS[sdk=iphonesimulator*]';
const MARKER = '# Sency: x86_64 simulator only';

module.exports = function withX86SimulatorOnly(config) {
  config = withXcodeProject(config, mod => {
    const configurations = mod.modResults.pbxXCBuildConfigurationSection();
    for (const entry of Object.values(configurations)) {
      if (entry && entry.buildSettings && entry.buildSettings.PRODUCT_NAME) {
        entry.buildSettings[`"${SETTING}"`] = 'arm64';
      }
    }
    return mod;
  });
  return withPodfile(config, mod => {
    const contents = mod.modResults.contents;
    if (contents.includes(MARKER)) return mod;
    const hook = /post_install do \|installer\|\n/;
    if (!hook.test(contents)) throw new Error('Missing post_install block in Podfile');
    mod.modResults.contents = contents.replace(hook, match => match +
      `    ${MARKER}\n` +
      '    installer.pods_project.targets.each do |target|\n' +
      `      target.build_configurations.each { |c| c.build_settings['${SETTING}'] = 'arm64' }\n` +
      '    end\n');
    return mod;
  });
};
