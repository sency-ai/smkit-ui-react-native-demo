# [react-native-smkit-ui demo](https://github.com/sency-ai/smkit-sdk)

This demo is aligned with `@sency/react-native-smkit-ui` `2.4.2`.

Native versions declared by the React Native package:
- iOS: `SMKitUI` / `SMKit` `2.5.1`
- Android: `com.sency.smkitui:smkitui` / `com.sency.smkit:smkit` `1.9.3`

RN 2.4.2 uses the iOS 2.5.1 `exitSDK(completion:)` API.

The app mirrors the native iOS demo structure with a Settings screen, a Build Workout flow, assessment examples, custom assessment examples, and workout-from-program examples.

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Configure](#configure)
4. [Start](#start)
5. [UI Customization and Phone Calibration](#ui-customization-and-phone-calibration)
6. [Excluding Feedback](#excluding-feedback)
7. [Setting Text Language](#setting-text-language)
8. [Setting Pause Types](#setting-pause-types)
9. [Advanced Configuration](#advanced-configuration)
10. [Exercise and Workout Options](#exercise-and-workout-options)
11. [Platform Notes](#platform-notes)
12. [Customer Update](#customer-update)

## Installation

Install the React Native package:

```sh
npm install @sency/react-native-smkit-ui@2.4.2
```

This demo installs the published package:

```json
"@sency/react-native-smkit-ui": "2.4.2"
```

Then install native dependencies:

```sh
cd ios
pod install
cd ..
```

## Local authentication key

The demo reads its default auth key from a local, Git-ignored `.env` file. Create
it from the example and enter the internal key locally:

```sh
cp .env.example .env
```

```dotenv
API_PUBLIC_KEY=YOUR_INTERNAL_KEY
```

The key is prefilled in the Configure screen, where it can still be changed for
the current app session. Do not commit `.env`; values compiled into a mobile app
can be recovered by its users.

## Setup

- [iOS Setup](docs/ios-setup.md)
- [Android Setup](docs/android-setup.md)

The native setup must include camera permissions, the Sency iOS pod source, and the Sency Android Maven repository described in those guides.

## Configure

Configure SMKitUI as early as possible, usually on app launch:

```ts
import { configure } from '@sency/react-native-smkit-ui';

await configure('YOUR_AUTH_KEY');
```

To reduce wait time, call `configure` before the user starts an assessment or workout.

**Important:** SMKitUI will not start a session until `configure` succeeds.

## Start

The demo includes examples for the main SDK entry points:

- [Start Assessment](Assessment.md)
- [Start Workout](Workout.md)
- [Build Your Own Assessment](CustomizedAssessment.md)
- [Workout From Program](wfp.md)
- Build Workout, implemented in [components/WorkoutBuilderScreen.tsx](components/WorkoutBuilderScreen.tsx)

### Start Assessment

```ts
import {
  startAssessment,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

const result = await startAssessment(
  SMWorkoutLibrary.AssessmentTypes.Fitness,
  true,
  null,
  false,
  '',
  JSON.stringify({
    primaryColor: '#4CAF50',
    phoneCalibration: { enabled: true },
  })
);
```

### Start a Custom Workout

```ts
import {
  startCustomWorkout,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

const workout = new SMWorkoutLibrary.SMWorkout(
  'demo-workout',
  'Demo Workout',
  null,
  null,
  [
    new SMWorkoutLibrary.SMExercise(
      'Squat Regular',
      30,
      'SquatRegularInstructionVideo',
      null,
      [
        SMWorkoutLibrary.UIElement.Timer,
        SMWorkoutLibrary.UIElement.RepsCounter,
        SMWorkoutLibrary.UIElement.GaugeOfMotion,
      ],
      'SquatRegular',
      null,
      null
    ),
  ],
  null,
  null,
  null
);

const result = await startCustomWorkout(
  workout,
  JSON.stringify({
    phoneCalibration: { enabled: true },
  })
);
```

## UI Customization and Phone Calibration

Use the `modifications` JSON string when starting a session to customize simple UI values and phone calibration:

```ts
const modifications = JSON.stringify({
  primaryColor: '#4CAF50',
  phoneCalibration: {
    enabled: true,
  },
  showProgressBar: true,
  showCounters: true,
});
```

The demo keeps these values in `DemoSettings` and applies them to assessments, custom workouts, custom assessments, and workout-from-program sessions.

## Excluding Feedback

You can exclude feedback from the in-session UI:

```ts
import { setFeedbacksUIToExclude } from '@sency/react-native-smkit-ui';

await setFeedbacksUIToExclude(['PushupKneesOnFloor']);
```

You can also exclude feedback from data and UI where supported:

```ts
import { setExcludedFeedbacks } from '@sency/react-native-smkit-ui';

await setExcludedFeedbacks(['PushupKneesOnFloor']);
```

Platform note: data-level feedback exclusion depends on native platform support. UI-only exclusion is the safer cross-platform default.

## Setting Text Language

Set session text and phone calibration text before starting a session:

```ts
import {
  setPhoneCalibrationLanguage,
  setSessionLanguage,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

await setSessionLanguage(SMWorkoutLibrary.Language.English);
await setPhoneCalibrationLanguage(SMWorkoutLibrary.Language.English);
```

Currently advertised demo languages are English and Hebrew.

## Setting Pause Types

Choose the pause dialog buttons before a session starts:

```ts
import { setPauseTypes, SMWorkoutLibrary } from '@sency/react-native-smkit-ui';

await setPauseTypes([
  SMWorkoutLibrary.PauseType.Resume,
  SMWorkoutLibrary.PauseType.Skip,
  SMWorkoutLibrary.PauseType.Quit,
]);
```

## Advanced Configuration

Set advanced SDK behavior before starting a session. The demo exposes these controls in the UI Settings screen.

```ts
import {
  setColorTheme,
  setCounterPreferences,
  setEnableButtonTutorial,
  setEnableHeartRateRest,
  setEnableWatchCompanion,
  setEndExercisePreferences,
  setFeedbacksUIToExclude,
  setExerciseSummaryTimingMetricsEnabled,
  setGuidanceDebugLogging,
  setGuidanceModeSuggestionEnabled,
  setHeartRateRestThreshold,
  setIncludeAssessmentInsights,
  setInstructionVideoConfig,
  setIntelligenceRestEnabled,
  setPhoneMovementCountPreventionEnabled,
  setPlayBodyCalibrationAudio,
  setPlayPhoneCalibrationAudio,
  setPoseModelChoice,
  setSkeletonSettings,
  setSmallBodyPartFocusEnabled,
  setStartTimerOnFirstActivity,
  setShowDebugBoundingBox,
  setUseDefaultGuidanceMode,
  setVariationMismatchFeedbackEnabled,
  setWorkoutContinuationTimerDuration,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

await setIntelligenceRestEnabled(true);
await setPlayPhoneCalibrationAudio(true);
await setPlayBodyCalibrationAudio(true);
await setEnableButtonTutorial(true);
await setShowDebugBoundingBox(false);
await setEnableWatchCompanion(true);
await setEnableHeartRateRest(true);
await setHeartRateRestThreshold(160);
await setStartTimerOnFirstActivity(true);
await setPhoneMovementCountPreventionEnabled(true);
await setVariationMismatchFeedbackEnabled(true);
await setWorkoutContinuationTimerDuration(8);
await setColorTheme(SMWorkoutLibrary.ColorTheme.Green);
await setCounterPreferences(SMWorkoutLibrary.CounterPreferences.PerfectOnly);
await setEndExercisePreferences(
  SMWorkoutLibrary.EndExercisePreferences.TargetBased
);
await setInstructionVideoConfig({
  displayMode: 'mediumCycle',
  mediumSizeCycles: 3,
});
await setSkeletonSettings({
  hidden: false,
  preset: SMWorkoutLibrary.SkeletonPreset.NeonGlow,
  connectionStyle: SMWorkoutLibrary.SkeletonConnectionStyle.Solid,
  jointShape: SMWorkoutLibrary.SkeletonJointShape.Circle,
  dotsOpacity: 1,
  connectionsOpacity: 0.8,
});
await setUseDefaultGuidanceMode(true);
await setGuidanceDebugLogging(false);
await setFeedbacksUIToExclude(['PushupKneesOnFloor']);
```

### Android 1.8 Configuration

Choose these options before `configure()`. The demo exposes them from UI Settings before initialization; timing metrics and insight inclusion affect the next configuration only.

```ts
import {
  setExerciseSummaryTimingMetricsEnabled,
  setGuidanceModeSuggestionEnabled,
  setIncludeAssessmentInsights,
  setPoseModelChoice,
  setSmallBodyPartFocusEnabled,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

await setPoseModelChoice(SMWorkoutLibrary.PoseModelChoice.AdaptiveChoice);
await setGuidanceModeSuggestionEnabled(true);
await setSmallBodyPartFocusEnabled(true);
await setExerciseSummaryTimingMetricsEnabled(true);
await setIncludeAssessmentInsights(true);
```

### Android Guidance Config

Android also supports an optional native config string:

```ts
import { setConfigString } from '@sency/react-native-smkit-ui';

await setConfigString('key=value');
```

### Runtime Controls

```ts
import {
  clearAdaptiveRomCache,
  quitWorkout,
} from '@sency/react-native-smkit-ui';

await quitWorkout();
await clearAdaptiveRomCache();
```

Platform note: `pauseSDK()` and `resumeSDK()` are iOS-only. On Android, use the in-session pause UI.

## Exercise and Workout Options

The Build Workout screen starts empty, loads supported movements on iOS, falls back to the demo catalog on Android, filters out Rowing, and lets you add, remove, reorder, configure, and start exercises. On iOS it also displays the native exercise type returned by `getExerciseType()` when an exercise is added.

The builder exposes:
- Duration
- Phone position
- Guidance mode
- Short intro
- Pre-exercise countdown audio
- Rep milestone voice and interval
- Sound on each rep
- Android target-reps completion voice and intent voice feedback
- Android target-reps progress (with a reps scoring target)
- Adaptive ROM feedback and warmup reps
- Stretch-set repetitions, seconds, and rest
- Android position repetitions, with target reps and seconds per rep
- Android display context (warm-up/main-set circuit titles) and insight export
- Workout continuation

The Android demo intentionally does not show wide-angle camera because that control is iOS-only.

### Adaptive ROM

```ts
new SMWorkoutLibrary.SMExercise(
  'Squat Regular',
  30,
  'SquatRegularInstructionVideo',
  null,
  [SMWorkoutLibrary.UIElement.Timer, SMWorkoutLibrary.UIElement.RepsCounter],
  'SquatRegular',
  null,
  null,
  {
    adaptiveRomFeedbackEnabled: true,
    adaptiveRomWarmupReps: 2,
  }
);
```

### Per-Exercise Audio

```ts
new SMWorkoutLibrary.SMExercise(
  'High Knees',
  30,
  'HighKneesInstructionVideo',
  null,
  [SMWorkoutLibrary.UIElement.Timer, SMWorkoutLibrary.UIElement.RepsCounter],
  'HighKnees',
  null,
  null,
  {
    playPreExerciseCountdown: true,
    playRepMilestoneVoice: true,
    repMilestoneInterval: 5,
    playSoundOnEachRep: true,
  }
);
```

### Stretch Sets

```ts
new SMWorkoutLibrary.SMExercise(
  'Downward Dog',
  40,
  'DownwardDogStretchInstructionVideo',
  null,
  [SMWorkoutLibrary.UIElement.Timer],
  'DownwardDogStretch',
  null,
  null,
  {
    stretchSetConfig: new SMWorkoutLibrary.StretchSetConfig(3, 8, {
      restSecondsBetweenStretches: 4,
    }),
  }
);
```

### Workout Continuation

```ts
const continuation = new SMWorkoutLibrary.WorkoutContinuation(
  '',
  [
    new SMWorkoutLibrary.SMExercise(
      'Jumping Jacks',
      20,
      'JumpingJacksInstructionVideo',
      null,
      [SMWorkoutLibrary.UIElement.Timer, SMWorkoutLibrary.UIElement.RepsCounter],
      'JumpingJacks',
      null,
      null
    ),
  ],
  null
);
```

The demo Build Workout mode does not attach custom workout sounds.

## Platform Notes

- iOS-only: `pauseSDK`, `resumeSDK`, `getSupportedMovements`, `getExerciseType`, exercise `useWideAngleCamera`, rowing phone calibration, accurate pose estimation, debug bounding box, Watch companion, and heart-rate-rest controls. The matching settings resolve as no-ops on Android for API parity.
- Android-only: `clearAdaptiveRomCache`, `setConfigString`, `setPoseModelChoice`, guidance-mode suggestions, small-body-part focus, exercise-summary timing metrics, assessment insights, target-reps completion voice, intent voice feedback, position reps, and pause buttons `Rest` / `Switch`.
- iOS-focused: audio mixing and external audio control depend on native iOS audio session behavior.
- Cross-platform: phone calibration, session language, core pause buttons, instruction video config, skeleton styling, adaptive ROM, guidance mode, countdown audio, rep audio, stretch sets, phone movement prevention, variation mismatch feedback, button tutorial, and workout continuation.

Having issues? [Contact us](mailto:support@sency.ai) and let us know what the problem is.

## Run this demo on a phone

From the demo root, run `npm ci` to install the published 2.4.2 package. Start Metro in a terminal with `npm start` and keep it running while using a Debug build.

For iPhone, connect and unlock the phone, open `ios/RNSMKitUIDemoApp.xcworkspace` in Xcode, select your development team and iPhone, then press Run. Install the iOS pods as shown above first.

For a standalone iPhone build with JavaScript bundled, run `npx react-native run-ios --device --mode Release` from the demo root after installing pods. This Release build does not need Metro.

For Android, connect and unlock the phone, then run:

```sh
adb devices
adb reverse tcp:8081 tcp:8081
cd android
./gradlew :app:installDebug
cd ..
adb shell am start -n com.rnsmkituidemoapp/.MainActivity
```

Allow camera access when prompted. Configure the SDK with your key before starting an assessment.
