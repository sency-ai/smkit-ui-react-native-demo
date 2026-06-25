# [react-native-smkit-ui demo](https://github.com/sency-ai/smkit-sdk)

This demo is aligned with `@sency/react-native-smkit-ui` `2.4.0`.

Native versions declared by the React Native package:
- iOS: `SMKitUI` / `SMKit` `2.0.2`
- Android: `com.sency.smkitui:smkitui` / `com.sency.smkit:smkit` `1.7.0`

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
npm install @sency/react-native-smkit-ui@2.4.0
```

For this local demo, `package.json` points to the packaged local tarball:

```json
"@sency/react-native-smkit-ui": "file:../smkit_ui_library/react-native-smkit-ui/sency-react-native-smkit-ui-2.4.0.tgz"
```

Then install native dependencies:

```sh
cd ios
pod install
cd ..
```

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
  setEndExercisePreferences,
  setGuidanceDebugLogging,
  setInstructionVideoConfig,
  setIntelligenceRestEnabled,
  setPhoneMovementCountPreventionEnabled,
  setPlayBodyCalibrationAudio,
  setPlayPhoneCalibrationAudio,
  setSkeletonSettings,
  setStartTimerOnFirstActivity,
  setUseDefaultGuidanceMode,
  setVariationMismatchFeedbackEnabled,
  setWorkoutContinuationTimerDuration,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

await setIntelligenceRestEnabled(true);
await setPlayPhoneCalibrationAudio(true);
await setPlayBodyCalibrationAudio(true);
await setEnableButtonTutorial(true);
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

The Build Workout screen starts empty, loads supported movements on iOS, falls back to the demo catalog on Android, filters out Rowing, and lets you add, remove, reorder, configure, and start exercises.

The builder exposes:
- Duration
- Phone position
- Guidance mode
- Short intro
- Pre-exercise countdown audio
- Rep milestone voice and interval
- Sound on each rep
- Adaptive ROM feedback and warmup reps
- Stretch-set repetitions, seconds, and rest
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

- iOS-only: `pauseSDK`, `resumeSDK`, `getSupportedMovements`, `getExerciseType`, exercise `useWideAngleCamera`, rowing phone calibration, and accurate pose estimation controls.
- Android-only: `clearAdaptiveRomCache`, `setConfigString`, `setPoseModelChoice`, and pause buttons `Rest` / `Switch`.
- iOS-focused: audio mixing and external audio control depend on native iOS audio session behavior.
- Cross-platform: phone calibration, session language, core pause buttons, instruction video config, skeleton styling, adaptive ROM, guidance mode, countdown audio, rep audio, stretch sets, phone movement prevention, variation mismatch feedback, button tutorial, and workout continuation.

Having issues? [Contact us](mailto:support@sency.ai) and let us know what the problem is.
