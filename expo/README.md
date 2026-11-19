# Expo Router assessment example

This local example targets Expo 57 and React Native 0.86.3. It uses the adjacent smkit_ui_library checkout with Android 1.9.7 and iOS 2.7.1.

From this directory, set up the candidate SDKs before prebuild. Keep the variables exported while installing pods and running Gradle.

```sh
(cd ../../smkit_android && ./gradlew publishApi24ConsumerArtifacts)
export SMKIT_LOCAL_ANDROID_REPO="$(cd ../../smkit_android/repo && pwd)"
export SMKIT_LOCAL_IOS_ROOT="${TMPDIR:-/tmp}/sency-2.7.1-pods"
node ../../smkit_ui_library/react-native-smkit-ui/scripts/prepare-local-ios-pods.cjs ../../smkitui "$SMKIT_LOCAL_IOS_ROOT"
npm ci --install-links --ignore-scripts
npx expo prebuild --no-install
(cd ios && pod install)
```

Start Metro with `npx expo start`. For Android, run `npx expo run:android --device` and choose an emulator. The iOS 2.7.1 artifacts contain an x86_64 simulator slice. On Apple Silicon choose a Rosetta simulator destination in Xcode, or build it from the expo directory with the following command.

```sh
xcodebuild -workspace ios/SencyExpo57.xcworkspace -scheme SencyExpo57 -configuration Debug -destination "generic/platform=iOS Simulator" ARCHS=x86_64 ONLY_ACTIVE_ARCH=YES build
```

Enter your Sency key and tap **Start fitness assessment** or **Start eccentric squat**. The squat workout targets five reps with a three-second lowering phase.

Choose **Start squat and hip abduction combo** to run recipe `Combo04`. Each of the five target rounds uses two squats and one left standing hip abduction.

Choose **Start standalone pacer** for a 30-second squat block with one beat every three seconds.
