import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SMWorkoutLibrary } from '@sency/react-native-smkit-ui';
import {
  applyDemoSettings,
  COLOR_THEME_OPTIONS,
  DemoCounterPreference,
  DemoEndExercisePreference,
  DemoInstructionVideoMode,
  DemoSettings,
  displayName,
  LANGUAGE_OPTIONS,
  PAUSE_TYPE_OPTIONS,
  SKELETON_COLOR_OPTIONS,
  SKELETON_CONNECTION_OPTIONS,
  SKELETON_JOINT_OPTIONS,
  SKELETON_PRESET_OPTIONS,
  themeHex,
} from './demoSettings';

type Props = {
  settings: DemoSettings;
  onChange: (settings: DemoSettings) => void;
  onDone: () => void;
};

const INSTRUCTION_VIDEO_MODES: DemoInstructionVideoMode[] = [
  'default',
  'mediumCycle',
];
const END_EXERCISE_OPTIONS: DemoEndExercisePreference[] = [
  'timer',
  'targetBased',
];
const COUNTER_OPTIONS: DemoCounterPreference[] = ['default', 'perfectOnly'];
const POSE_MODEL_OPTIONS = Object.values(SMWorkoutLibrary.PoseModelChoice);

const SKELETON_COLOR_HEX: Record<string, string> = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF3B30',
  blue: '#007AFF',
  green: '#34C759',
  yellow: '#FFCC00',
  orange: '#FF9500',
  purple: '#AF52DE',
  gray: '#8E8E93',
  cyan: '#32ADE6',
  lightGray: '#D1D1D6',
  darkGray: '#48484A',
  offWhite: '#F2F2F7',
  charcoal: '#36454F',
  lightBlue: '#ADD8E6',
  darkBlue: '#00008B',
  lightGreen: '#90EE90',
  darkGreen: '#006400',
  lightPurple: '#DDA0DD',
  darkPurple: '#4B0082',
  gold: '#FFD700',
  darkGold: '#B8860B',
  lightPink: '#FFB6C1',
  darkPink: '#C71585',
  mediumGray: '#9E9E9E',
  silver: '#C0C0C0',
  navy: '#000080',
  forestGreen: '#228B22',
  lavender: '#E6E6FA',
  rosePink: '#FF66B2',
};

const UISettingsScreen = ({ settings, onChange, onDone }: Props) => {
  const apply = (next: DemoSettings) => {
    applyDemoSettings(next).catch(error => {
      Alert.alert('Unable to apply settings', String(error));
    });
  };

  const update = (patch: Partial<DemoSettings>, shouldApply = true) => {
    const next = { ...settings, ...patch };
    onChange(next);
    if (shouldApply) {
      apply(next);
    }
  };

  const close = () => {
    apply(settings);
    onDone();
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>UI Settings</Text>
        <Pressable onPress={close} style={s.headerButton}>
          <Text style={s.headerButtonText}>Done</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Section title="Demo" />
        <ToggleRow
          label="Show phone calibration"
          value={settings.showPhoneCalibration}
          onValueChange={showPhoneCalibration =>
            update({ showPhoneCalibration })
          }
        />
        <ToggleRow
          label="Enable workout continuation"
          value={settings.enableWorkoutContinuation}
          onValueChange={enableWorkoutContinuation =>
            update({ enableWorkoutContinuation })
          }
        />
        <ToggleRow
          label="Configure highlights on next launch"
          value={settings.configureHighlightsOnNextLaunch}
          onValueChange={configureHighlightsOnNextLaunch =>
            update({ configureHighlightsOnNextLaunch }, false)
          }
        />
        <ToggleRow
          label="Debug bounding box"
          value={settings.showDebugBoundingBox}
          onValueChange={showDebugBoundingBox =>
            update({ showDebugBoundingBox })
          }
        />

        <Section title="Appearance" />
        <ChoiceRow
          label="Color theme"
          value={settings.colorTheme}
          options={COLOR_THEME_OPTIONS}
          onChange={colorTheme => update({ colorTheme })}
          chipStyle={option => ({ borderColor: themeHex(option) })}
        />
        <ToggleRow
          label="Hide skeleton"
          value={settings.skeletonHidden}
          onValueChange={skeletonHidden => update({ skeletonHidden })}
        />
        <ChoiceRow
          label="Skeleton preset"
          value={settings.skeletonPreset}
          options={SKELETON_PRESET_OPTIONS}
          onChange={skeletonPreset => update({ skeletonPreset })}
        />
        <ChoiceRow
          label="Connection style"
          value={settings.skeletonConnectionStyle}
          options={SKELETON_CONNECTION_OPTIONS}
          onChange={skeletonConnectionStyle =>
            update({ skeletonConnectionStyle })
          }
        />
        <ChoiceRow
          label="Joint shape"
          value={settings.skeletonJointShape}
          options={SKELETON_JOINT_OPTIONS}
          onChange={skeletonJointShape => update({ skeletonJointShape })}
        />
        <NumberRow
          label="Dots opacity"
          value={settings.skeletonDotsOpacity}
          min={0}
          max={1}
          step={0.1}
          onChange={skeletonDotsOpacity => update({ skeletonDotsOpacity })}
        />
        <NumberRow
          label="Connections opacity"
          value={settings.skeletonConnectionsOpacity}
          min={0}
          max={1}
          step={0.1}
          onChange={skeletonConnectionsOpacity =>
            update({ skeletonConnectionsOpacity })
          }
        />
        <ColorRow
          label="Dots inner color"
          value={settings.skeletonDotsInnerColor}
          onChange={skeletonDotsInnerColor =>
            update({ skeletonDotsInnerColor })
          }
        />
        <ColorRow
          label="Dots outer color"
          value={settings.skeletonDotsOuterColor}
          onChange={skeletonDotsOuterColor =>
            update({ skeletonDotsOuterColor })
          }
        />
        <ColorRow
          label="Connections inner color"
          value={settings.skeletonConnectionsInnerColor}
          onChange={skeletonConnectionsInnerColor =>
            update({ skeletonConnectionsInnerColor })
          }
        />
        <ColorRow
          label="Connections outer color"
          value={settings.skeletonConnectionsOuterColor}
          onChange={skeletonConnectionsOuterColor =>
            update({ skeletonConnectionsOuterColor })
          }
        />
        <NumberRow
          label="Dots glow"
          value={settings.skeletonDotsGlow}
          min={0}
          max={1}
          step={0.1}
          onChange={skeletonDotsGlow => update({ skeletonDotsGlow })}
        />
        <NumberRow
          label="Connections glow"
          value={settings.skeletonConnectionsGlow}
          min={0}
          max={1}
          step={0.1}
          onChange={skeletonConnectionsGlow =>
            update({ skeletonConnectionsGlow })
          }
        />
        <NumberRow
          label="Line width scale"
          value={settings.skeletonLineWidthScale}
          min={0.5}
          max={2}
          step={0.1}
          onChange={skeletonLineWidthScale =>
            update({ skeletonLineWidthScale })
          }
        />
        <NumberRow
          label="Outline scale"
          value={settings.skeletonOutlineScale}
          min={0.5}
          max={2}
          step={0.1}
          onChange={skeletonOutlineScale => update({ skeletonOutlineScale })}
        />
        <NumberRow
          label="Softness"
          value={settings.skeletonSoftness}
          min={0}
          max={1}
          step={0.1}
          onChange={skeletonSoftness => update({ skeletonSoftness })}
        />
        <NumberRow
          label="Animation duration"
          value={settings.skeletonAnimationDuration}
          min={0}
          max={0.05}
          step={0.01}
          precision={3}
          onChange={skeletonAnimationDuration =>
            update({ skeletonAnimationDuration })
          }
        />

        <Section title="Audio and Calibration" />
        <ToggleRow
          label="Allow audio mixing"
          value={settings.allowAudioMixing}
          onValueChange={allowAudioMixing => update({ allowAudioMixing })}
        />
        <ToggleRow
          label="Show external audio control"
          value={settings.showExternalAudioControl}
          onValueChange={showExternalAudioControl =>
            update({ showExternalAudioControl })
          }
        />
        <ToggleRow
          label="Phone calibration audio"
          value={settings.playPhoneCalibrationAudio}
          onValueChange={playPhoneCalibrationAudio =>
            update({ playPhoneCalibrationAudio })
          }
        />
        <ToggleRow
          label="Body calibration audio"
          value={settings.playBodyCalibrationAudio}
          onValueChange={playBodyCalibrationAudio =>
            update({ playBodyCalibrationAudio })
          }
        />
        <ChoiceRow
          label="Session language"
          value={settings.sessionLanguage}
          options={LANGUAGE_OPTIONS}
          onChange={sessionLanguage => update({ sessionLanguage })}
        />
        <ChoiceRow
          label="Phone calibration language"
          value={settings.phoneCalibrationLanguage}
          options={LANGUAGE_OPTIONS}
          onChange={phoneCalibrationLanguage =>
            update({ phoneCalibrationLanguage })
          }
        />

        <Section title="Session Behavior" />
        <ToggleRow
          label="Accurate pose estimation"
          value={settings.accuratePoseEstimation}
          onValueChange={accuratePoseEstimation =>
            update({ accuratePoseEstimation })
          }
        />
        <ToggleRow
          label="Watch companion (iOS)"
          value={settings.enableWatchCompanion}
          onValueChange={enableWatchCompanion =>
            update({ enableWatchCompanion })
          }
        />
        <ToggleRow
          label="Heart-rate rest (iOS)"
          value={settings.enableHeartRateRest}
          onValueChange={enableHeartRateRest => update({ enableHeartRateRest })}
        />
        <NumberRow
          label="Heart-rate rest threshold (iOS)"
          value={settings.heartRateRestThreshold}
          min={80}
          max={220}
          step={5}
          suffix="bpm"
          onChange={heartRateRestThreshold =>
            update({ heartRateRestThreshold })
          }
        />
        <ToggleRow
          label="Intelligence rest"
          value={settings.enableIntelligenceRest}
          onValueChange={enableIntelligenceRest =>
            update({ enableIntelligenceRest })
          }
        />
        <ToggleRow
          label="Timer starts on first activity"
          value={settings.startTimerOnFirstActivity}
          onValueChange={startTimerOnFirstActivity =>
            update({ startTimerOnFirstActivity })
          }
        />
        <ToggleRow
          label="Prevent count while phone moves"
          value={settings.enablePhoneMovementCountPrevention}
          onValueChange={enablePhoneMovementCountPrevention =>
            update({ enablePhoneMovementCountPrevention })
          }
        />
        <ToggleRow
          label="Variation mismatch feedback"
          value={settings.enableVariationMismatchFeedback}
          onValueChange={enableVariationMismatchFeedback =>
            update({ enableVariationMismatchFeedback })
          }
        />
        <ToggleRow
          label="Button hover tutorial"
          value={settings.enableButtonTutorial}
          onValueChange={enableButtonTutorial =>
            update({ enableButtonTutorial })
          }
        />
        <NumberRow
          label="Continuation timer"
          value={settings.workoutContinuationTimerDuration}
          min={1}
          max={60}
          step={1}
          suffix="s"
          onChange={workoutContinuationTimerDuration =>
            update({ workoutContinuationTimerDuration })
          }
        />
        <ChoiceRow
          label="End exercise"
          value={settings.endExercisePreference}
          options={END_EXERCISE_OPTIONS}
          onChange={endExercisePreference => update({ endExercisePreference })}
        />
        <ChoiceRow
          label="Counter preference"
          value={settings.counterPreference}
          options={COUNTER_OPTIONS}
          onChange={counterPreference => update({ counterPreference })}
        />

        <Section title="Instruction Video" />
        <ChoiceRow
          label="Display mode"
          value={settings.instructionVideoMode}
          options={INSTRUCTION_VIDEO_MODES}
          onChange={instructionVideoMode => update({ instructionVideoMode })}
        />
        <NumberRow
          label="Medium cycles"
          value={settings.instructionMediumCycles}
          min={1}
          max={5}
          step={1}
          onChange={instructionMediumCycles =>
            update({ instructionMediumCycles })
          }
        />

        <Section title="Android Guidance" />
        <ChoiceRow
          label="Pose model (Android; next configure)"
          value={settings.poseModelChoice}
          options={POSE_MODEL_OPTIONS}
          onChange={poseModelChoice => update({ poseModelChoice }, false)}
        />
        <ToggleRow
          label="Use default guidance mode"
          value={settings.useDefaultGuidanceMode}
          onValueChange={useDefaultGuidanceMode =>
            update({ useDefaultGuidanceMode })
          }
        />
        <ToggleRow
          label="Guidance-mode suggestions (Android)"
          value={settings.guidanceModeSuggestion}
          onValueChange={guidanceModeSuggestion =>
            update({ guidanceModeSuggestion })
          }
        />
        <ToggleRow
          label="Guidance debug logging"
          value={settings.guidanceDebugLogging}
          onValueChange={guidanceDebugLogging =>
            update({ guidanceDebugLogging })
          }
        />
        <TextInput
          style={s.textInput}
          value={settings.androidConfigString}
          onChangeText={androidConfigString =>
            update({ androidConfigString }, false)
          }
          onBlur={() => apply(settings)}
          placeholder="Android config string"
          placeholderTextColor="#8E8E93"
        />

        <Section title="Android 1.8 Insights" />
        <ToggleRow
          label="Small-body-part focus"
          value={settings.smallBodyPartFocus}
          onValueChange={smallBodyPartFocus => update({ smallBodyPartFocus })}
        />
        <ToggleRow
          label="Exercise summary timing metrics (next configure)"
          value={settings.exerciseSummaryTimingMetrics}
          onValueChange={exerciseSummaryTimingMetrics =>
            update({ exerciseSummaryTimingMetrics }, false)
          }
        />
        <ToggleRow
          label="Include assessment insights (next configure)"
          value={settings.includeAssessmentInsights}
          onValueChange={includeAssessmentInsights =>
            update({ includeAssessmentInsights }, false)
          }
        />
        <ToggleRow
          label="Export assessment insights in custom sessions"
          value={settings.exportAssessmentInsights}
          onValueChange={exportAssessmentInsights =>
            update({ exportAssessmentInsights }, false)
          }
        />
        <ToggleRow
          label="Exercise progress display context"
          value={settings.exerciseProgressDisplay}
          onValueChange={exerciseProgressDisplay =>
            update({ exerciseProgressDisplay }, false)
          }
        />

        <Section title="Feedback Filtering" />
        <View style={s.optionBlock}>
          <Text style={s.optionLabel}>UI feedbacks to exclude</Text>
          <TextInput
            style={s.textInput}
            value={settings.feedbacksUIToExclude.join(', ')}
            onChangeText={value =>
              update(
                {
                  feedbacksUIToExclude: value
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean),
                },
                false,
              )
            }
            onBlur={() => apply(settings)}
            placeholder="PushupKneesOnFloor, …"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <Section title="Pause Buttons" />
        {PAUSE_TYPE_OPTIONS.map(pauseType => (
          <ToggleRow
            key={pauseType}
            label={displayName(pauseType)}
            value={settings.allowedPauseTypes.includes(pauseType)}
            onValueChange={checked => {
              const allowedPauseTypes = checked
                ? Array.from(
                    new Set([...settings.allowedPauseTypes, pauseType]),
                  )
                : settings.allowedPauseTypes.filter(item => item !== pauseType);
              update({ allowedPauseTypes });
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title }: { title: string }) => (
  <Text style={s.section}>{title}</Text>
);

const ToggleRow = ({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const ChoiceRow = <T extends string>({
  label,
  value,
  options,
  onChange,
  chipStyle,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  chipStyle?: (value: T) => object;
}) => (
  <View style={s.optionBlock}>
    <Text style={s.optionLabel}>{label}</Text>
    <View style={s.chipWrap}>
      {options.map(option => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            style={[s.chip, chipStyle?.(option), selected && s.chipSelected]}
            onPress={() => onChange(option)}
          >
            <Text style={[s.chipText, selected && s.chipTextSelected]}>
              {displayName(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const ColorRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SMWorkoutLibrary.SkeletonColorOption | null;
  onChange: (value: SMWorkoutLibrary.SkeletonColorOption | null) => void;
}) => (
  <View style={s.optionBlock}>
    <Text style={s.optionLabel}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Pressable
        style={[
          s.colorChip,
          s.presetChip,
          value === null && s.colorChipSelected,
        ]}
        onPress={() => onChange(null)}
      >
        <Text style={s.presetChipText}>P</Text>
      </Pressable>
      {SKELETON_COLOR_OPTIONS.map(option => (
        <Pressable
          key={option}
          style={[
            s.colorChip,
            { backgroundColor: SKELETON_COLOR_HEX[option] ?? '#8E8E93' },
            value === option && s.colorChipSelected,
          ]}
          onPress={() => onChange(option)}
        />
      ))}
    </ScrollView>
  </View>
);

const NumberRow = ({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  precision = Number.isInteger(step) ? 0 : 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  precision?: number;
  onChange: (value: number) => void;
}) => {
  const normalize = (next: number) =>
    Number(Math.max(min, Math.min(max, next)).toFixed(precision));
  const text = `${value.toFixed(precision)}${suffix ? ` ${suffix}` : ''}`;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={s.stepper}>
        <Pressable
          style={[s.stepperButton, value <= min && s.stepperButtonDisabled]}
          disabled={value <= min}
          onPress={() => onChange(normalize(value - step))}
        >
          <Text style={s.stepperText}>-</Text>
        </Pressable>
        <Text style={s.stepperValue}>{text}</Text>
        <Pressable
          style={[s.stepperButton, value >= max && s.stepperButtonDisabled]}
          disabled={value >= max}
          onPress={() => onChange(normalize(value + step))}
        >
          <Text style={s.stepperText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerButton: { paddingHorizontal: 10, paddingVertical: 6 },
  headerButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  section: {
    color: '#333',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 20,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#D1D1D6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  rowLabel: { color: '#000', flex: 1, fontSize: 15, paddingRight: 12 },
  optionBlock: {
    backgroundColor: '#fff',
    borderBottomColor: '#D1D1D6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionLabel: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderColor: '#D1D1D6',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText: { color: '#333', fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  colorChip: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginRight: 8,
    width: 36,
  },
  colorChipSelected: { borderColor: '#007AFF', borderWidth: 3 },
  presetChip: { backgroundColor: '#E5E5EA' },
  presetChipText: { color: '#333', fontSize: 12, fontWeight: '700' },
  stepper: { alignItems: 'center', flexDirection: 'row' },
  stepperButton: {
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    height: 30,
    justifyContent: 'center',
    width: 32,
  },
  stepperButtonDisabled: { opacity: 0.35 },
  stepperText: { color: '#007AFF', fontSize: 18, fontWeight: '700' },
  stepperValue: {
    color: '#000',
    fontSize: 14,
    minWidth: 68,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#C7C7CC',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: '#000',
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default UISettingsScreen;
