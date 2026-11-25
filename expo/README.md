# Expo example

This example targets Expo 57 and React Native 0.86.3. It uses the published `@sency/react-native-smkit-ui` 2.4.5 from npm, which pins iOS SMBase, SMKit and SMKitUI 2.7.3 and Android 1.9.9.

The package's config plugin adds the camera permission and usage text, Sency's CocoaPods source (`https://bitbucket.org/sencyai/ios_sdks_release.git`) and Sency's Maven repository (`https://artifacts.sency.ai/artifactory/release/`) during prebuild. From this directory:

```sh
cp .env.example .env   # then set EXPO_PUBLIC_API_PUBLIC_KEY (and optionally EXPO_PUBLIC_CUSTOMER_CODE)
npm ci
npx expo prebuild --clean --no-install
(cd ios && pod install)
```

Run prebuild with `SMKIT_LOCAL_ANDROID_REPO` and `SMKIT_LOCAL_IOS_ROOT` unset. When they are set, the plugin points the native projects at local SDK builds instead of the published ones.

Start Metro with `npx expo start`. For Android, run `npx expo run:android --device` and choose a device or emulator. For iOS, run `npx expo run:ios`.

The iOS 2.7.3 frameworks contain only an x86_64 simulator slice. The local `plugins/withX86SimulatorOnly.js` config plugin excludes arm64 from simulator builds of the app and its pods, so `npx expo run:ios` works on Apple Silicon simulators under Rosetta. Device builds are unaffected. `app.json` sets the Apple team used for device signing.

`.env` is Git-ignored. When it sets a key, the app configures the SDK on launch; otherwise enter the key on screen. Expo builds `EXPO_PUBLIC_` values into the app's JavaScript bundle, so anyone holding a built app can read the key: keep builds on internal devices.

The Expo app renders the regular demo's `App.tsx` and `components/` from the repository root, so both apps have the same screens and behaviour. `metro.config.js` resolves every package from `expo/node_modules`, never from the root's React Native 0.80 install, and maps `react-native-config` to `shims/react-native-config.ts`, which reads the `EXPO_PUBLIC_` values above.
