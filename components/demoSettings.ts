import {
  setAccuratePoseEstimation,
  setAllowAudioMixing,
  setColorTheme,
  setConfigString,
  setCounterPreferences,
  setEnableButtonTutorial,
  setEndExercisePreferences,
  setFeedbacksUIToExclude,
  setGuidanceDebugLogging,
  setInstructionVideoConfig,
  setIntelligenceRestEnabled,
  setPauseTypes,
  setPhoneCalibrationLanguage,
  setPhoneMovementCountPreventionEnabled,
  setPlayBodyCalibrationAudio,
  setPlayPhoneCalibrationAudio,
  setPoseModelChoice,
  setSessionLanguage,
  setShowExternalAudioControl,
  setSkeletonSettings,
  setStartTimerOnFirstActivity,
  setUseDefaultGuidanceMode,
  setVariationMismatchFeedbackEnabled,
  setWorkoutContinuationTimerDuration,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';
import * as SMKitUI from '@sency/react-native-smkit-ui';

type AsyncSetting = (...args: unknown[]) => Promise<void>;

/**
 * Apply optional native settings when present in the installed package.
 */
const applyOptionalSetting = async (
  name: string,
  ...args: unknown[]
): Promise<void> => {
  const setting = (SMKitUI as unknown as Record<string, unknown>)[name];
  if (typeof setting === 'function') {
    await (setting as AsyncSetting)(...args);
  }
};

export type DemoInstructionVideoMode = 'default' | 'mediumCycle';
export type DemoEndExercisePreference = 'timer' | 'targetBased';
export type DemoCounterPreference = 'default' | 'perfectOnly';
export type DemoFeedbackFrequency = 'off' | 'low' | 'normal' | 'high' | 'correctionsOnly';
export type DemoVoice = 'male_1' | 'female_1';

export type DemoSettings = {
  configureHighlightsOnNextLaunch: boolean;
  showPhoneCalibration: boolean;
  enableWorkoutContinuation: boolean;
  showDebugBoundingBox: boolean;

  colorTheme: SMWorkoutLibrary.ColorTheme;
  skeletonHidden: boolean;
  skeletonPreset: SMWorkoutLibrary.SkeletonPreset;
  skeletonConnectionStyle: SMWorkoutLibrary.SkeletonConnectionStyle;
  skeletonJointShape: SMWorkoutLibrary.SkeletonJointShape;
  skeletonDotsOpacity: number;
  skeletonConnectionsOpacity: number;
  skeletonDotsInnerColor: SMWorkoutLibrary.SkeletonColorOption | null;
  skeletonDotsOuterColor: SMWorkoutLibrary.SkeletonColorOption | null;
  skeletonConnectionsInnerColor: SMWorkoutLibrary.SkeletonColorOption | null;
  skeletonConnectionsOuterColor: SMWorkoutLibrary.SkeletonColorOption | null;
  skeletonDotsGlow: number;
  skeletonConnectionsGlow: number;
  skeletonLineWidthScale: number;
  skeletonOutlineScale: number;
  skeletonSoftness: number;
  skeletonAnimationDuration: number;

  allowAudioMixing: boolean;
  showExternalAudioControl: boolean;
  playPhoneCalibrationAudio: boolean;
  playBodyCalibrationAudio: boolean;
  sessionLanguage: SMWorkoutLibrary.Language;
  phoneCalibrationLanguage: SMWorkoutLibrary.Language;

  accuratePoseEstimation: boolean;
  enableWatchCompanion: boolean;
  enableHeartRateRest: boolean;
  heartRateRestThreshold: number;
  enableIntelligenceRest: boolean;
  startTimerOnFirstActivity: boolean;
  enablePhoneMovementCountPrevention: boolean;
  enableVariationMismatchFeedback: boolean;
  enableButtonTutorial: boolean;
  workoutContinuationTimerDuration: number;
  endExercisePreference: DemoEndExercisePreference;
  counterPreference: DemoCounterPreference;

  instructionVideoMode: DemoInstructionVideoMode;
  instructionMediumCycles: number;

  useDefaultGuidanceMode: boolean;
  guidanceDebugLogging: boolean;
  guidanceModeSuggestion: boolean;
  smallBodyPartFocus: boolean;
  poseModelChoice: SMWorkoutLibrary.PoseModelChoice;
  exerciseSummaryTimingMetrics: boolean;
  includeAssessmentInsights: boolean;
  feedbackFrequency: DemoFeedbackFrequency;
  voiceFeedbackVoice: DemoVoice;
  automaticallyPreloadModels: boolean;
  exportAssessmentInsights: boolean;
  exerciseProgressDisplay: boolean;
  androidConfigString: string;
  feedbacksUIToExclude: string[];

  allowedPauseTypes: SMWorkoutLibrary.PauseType[];
};

export const createDefaultDemoSettings = (): DemoSettings => ({
  configureHighlightsOnNextLaunch: false,
  showPhoneCalibration: true,
  enableWorkoutContinuation: false,
  showDebugBoundingBox: false,

  colorTheme: SMWorkoutLibrary.ColorTheme.Green,
  skeletonHidden: false,
  skeletonPreset: SMWorkoutLibrary.SkeletonPreset.Default,
  skeletonConnectionStyle: SMWorkoutLibrary.SkeletonConnectionStyle.Solid,
  skeletonJointShape: SMWorkoutLibrary.SkeletonJointShape.Circle,
  skeletonDotsOpacity: 1,
  skeletonConnectionsOpacity: 1,
  skeletonDotsInnerColor: null,
  skeletonDotsOuterColor: null,
  skeletonConnectionsInnerColor: null,
  skeletonConnectionsOuterColor: null,
  skeletonDotsGlow: 0,
  skeletonConnectionsGlow: 0,
  skeletonLineWidthScale: 1,
  skeletonOutlineScale: 1,
  skeletonSoftness: 0,
  skeletonAnimationDuration: 0,

  allowAudioMixing: true,
  showExternalAudioControl: true,
  playPhoneCalibrationAudio: false,
  playBodyCalibrationAudio: false,
  sessionLanguage: SMWorkoutLibrary.Language.English,
  phoneCalibrationLanguage: SMWorkoutLibrary.Language.English,

  accuratePoseEstimation: true,
  enableWatchCompanion: false,
  enableHeartRateRest: false,
  heartRateRestThreshold: 160,
  enableIntelligenceRest: false,
  startTimerOnFirstActivity: false,
  enablePhoneMovementCountPrevention: false,
  enableVariationMismatchFeedback: false,
  enableButtonTutorial: false,
  workoutContinuationTimerDuration: 10,
  endExercisePreference: 'timer',
  counterPreference: 'default',

  instructionVideoMode: 'default',
  instructionMediumCycles: 2,

  useDefaultGuidanceMode: false,
  guidanceDebugLogging: false,
  guidanceModeSuggestion: false,
  smallBodyPartFocus: false,
  poseModelChoice: SMWorkoutLibrary.PoseModelChoice.AdaptiveChoice,
  exerciseSummaryTimingMetrics: false,
  includeAssessmentInsights: false,
  feedbackFrequency: 'normal',
  voiceFeedbackVoice: 'male_1',
  automaticallyPreloadModels: true,
  exportAssessmentInsights: false,
  exerciseProgressDisplay: false,
  androidConfigString: '',
  feedbacksUIToExclude: ['PushupKneesOnFloor'],

  allowedPauseTypes: Object.values(SMWorkoutLibrary.PauseType),
});

export const COLOR_THEME_OPTIONS = Object.values(SMWorkoutLibrary.ColorTheme);
export const LANGUAGE_OPTIONS = Object.values(SMWorkoutLibrary.Language);
export const SKELETON_PRESET_OPTIONS = Object.values(
  SMWorkoutLibrary.SkeletonPreset,
);
export const SKELETON_CONNECTION_OPTIONS = Object.values(
  SMWorkoutLibrary.SkeletonConnectionStyle,
);
export const SKELETON_JOINT_OPTIONS = Object.values(
  SMWorkoutLibrary.SkeletonJointShape,
);
export const SKELETON_COLOR_OPTIONS = Object.values(
  SMWorkoutLibrary.SkeletonColorOption,
);
export const PAUSE_TYPE_OPTIONS = Object.values(SMWorkoutLibrary.PauseType);

/** Android configuration-time settings. Call this before configure(). */
export async function applyPreconfigureDemoSettings(
  settings: DemoSettings,
): Promise<void> {
  await setPoseModelChoice(settings.poseModelChoice);
  await applyOptionalSetting(
    'setGuidanceModeSuggestionEnabled',
    settings.guidanceModeSuggestion,
  );
  await applyOptionalSetting(
    'setSmallBodyPartFocusEnabled',
    settings.smallBodyPartFocus,
  );
  await applyOptionalSetting(
    'setExerciseSummaryTimingMetricsEnabled',
    settings.exerciseSummaryTimingMetrics,
  );
  await applyOptionalSetting(
    'setIncludeAssessmentInsights',
    settings.includeAssessmentInsights,
  );
}

const COLOR_THEME_HEX: Record<string, string> = {
  [SMWorkoutLibrary.ColorTheme.Blue]: '#2196F3',
  [SMWorkoutLibrary.ColorTheme.Green]: '#4CAF50',
  [SMWorkoutLibrary.ColorTheme.Purple]: '#9C27B0',
  [SMWorkoutLibrary.ColorTheme.Orange]: '#FF9800',
  [SMWorkoutLibrary.ColorTheme.Silver]: '#C0C0C0',
  [SMWorkoutLibrary.ColorTheme.Gold]: '#FFD700',
  [SMWorkoutLibrary.ColorTheme.Pink]: '#FF69B4',
};

export const themeHex = (theme: SMWorkoutLibrary.ColorTheme | string) =>
  COLOR_THEME_HEX[String(theme)] ?? '#4CAF50';

export const buildModifications = (settings: DemoSettings) =>
  JSON.stringify({
    primaryColor: themeHex(settings.colorTheme),
    phoneCalibration: {
      enabled: settings.showPhoneCalibration,
    },
    showProgressBar: true,
    showCounters: true,
  });

export const buildSkeletonConfig = (
  settings: DemoSettings,
): SMWorkoutLibrary.SkeletonConfig => ({
  hidden: settings.skeletonHidden,
  preset: settings.skeletonPreset,
  connectionStyle: settings.skeletonConnectionStyle,
  jointShape: settings.skeletonJointShape,
  dotsOpacity: settings.skeletonDotsOpacity,
  connectionsOpacity: settings.skeletonConnectionsOpacity,
  ...(settings.skeletonDotsInnerColor
    ? { dotsInnerColor: settings.skeletonDotsInnerColor }
    : {}),
  ...(settings.skeletonDotsOuterColor
    ? { dotsOuterColor: settings.skeletonDotsOuterColor }
    : {}),
  ...(settings.skeletonConnectionsInnerColor
    ? { connectionsInnerColor: settings.skeletonConnectionsInnerColor }
    : {}),
  ...(settings.skeletonConnectionsOuterColor
    ? { connectionsOuterColor: settings.skeletonConnectionsOuterColor }
    : {}),
  dotsGlow: settings.skeletonDotsGlow,
  connectionsGlow: settings.skeletonConnectionsGlow,
  lineWidthScale: settings.skeletonLineWidthScale,
  outlineScale: settings.skeletonOutlineScale,
  softness: settings.skeletonSoftness,
  animationDuration: settings.skeletonAnimationDuration,
});

export async function applyDemoSettings(settings: DemoSettings): Promise<void> {
  await setSkeletonSettings(buildSkeletonConfig(settings));
  await setColorTheme(settings.colorTheme);
  await setSessionLanguage(settings.sessionLanguage);
  await setPhoneCalibrationLanguage(settings.phoneCalibrationLanguage);
  await setEndExercisePreferences(
    settings.endExercisePreference === 'targetBased'
      ? SMWorkoutLibrary.EndExercisePreferences.TargetBased
      : SMWorkoutLibrary.EndExercisePreferences.Default,
  );
  await setCounterPreferences(
    settings.counterPreference === 'perfectOnly'
      ? SMWorkoutLibrary.CounterPreferences.PerfectOnly
      : SMWorkoutLibrary.CounterPreferences.Default,
  );
  await setInstructionVideoConfig({
    displayMode:
      settings.instructionVideoMode === 'mediumCycle'
        ? 'mediumCycle'
        : 'default',
    mediumSizeCycles: settings.instructionMediumCycles,
  });
  await setIntelligenceRestEnabled(settings.enableIntelligenceRest);
  await setAllowAudioMixing(settings.allowAudioMixing);
  await setShowExternalAudioControl(settings.showExternalAudioControl);
  await setAccuratePoseEstimation(settings.accuratePoseEstimation);
  await applyOptionalSetting(
    'setShowDebugBoundingBox',
    settings.showDebugBoundingBox,
  );
  await applyOptionalSetting(
    'setEnableWatchCompanion',
    settings.enableWatchCompanion,
  );
  await applyOptionalSetting(
    'setEnableHeartRateRest',
    settings.enableHeartRateRest,
  );
  await applyOptionalSetting(
    'setHeartRateRestThreshold',
    settings.heartRateRestThreshold,
  );
  await setPlayPhoneCalibrationAudio(settings.playPhoneCalibrationAudio);
  await setPlayBodyCalibrationAudio(settings.playBodyCalibrationAudio);
  await setStartTimerOnFirstActivity(settings.startTimerOnFirstActivity);
  await setWorkoutContinuationTimerDuration(
    settings.workoutContinuationTimerDuration,
  );
  await setPhoneMovementCountPreventionEnabled(
    settings.enablePhoneMovementCountPrevention,
  );
  await setVariationMismatchFeedbackEnabled(
    settings.enableVariationMismatchFeedback,
  );
  await setEnableButtonTutorial(settings.enableButtonTutorial);
  await setUseDefaultGuidanceMode(settings.useDefaultGuidanceMode);
  await applyOptionalSetting(
    'setGuidanceModeSuggestionEnabled',
    settings.guidanceModeSuggestion,
  );
  await setGuidanceDebugLogging(settings.guidanceDebugLogging);
  await applyOptionalSetting(
    'setSmallBodyPartFocusEnabled',
    settings.smallBodyPartFocus,
  );
  await applyOptionalSetting(
    'setExerciseSummaryTimingMetricsEnabled',
    settings.exerciseSummaryTimingMetrics,
  );
  await applyOptionalSetting(
    'setIncludeAssessmentInsights',
    settings.includeAssessmentInsights,
  );
  await setConfigString(settings.androidConfigString.trim() || null);
  await setFeedbacksUIToExclude(settings.feedbacksUIToExclude);
  await setPauseTypes(settings.allowedPauseTypes);
}

export function displayName(value: unknown): string {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
