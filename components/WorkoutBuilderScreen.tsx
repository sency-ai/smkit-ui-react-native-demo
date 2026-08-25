import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getExerciseType,
  getSupportedMovements,
  startCustomWorkout,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';
import {
  applyDemoSettings,
  buildModifications,
  DemoSettings,
  displayName,
} from './demoSettings';
import {
  displayNameForDetector,
  EXERCISE_CATALOG,
  fallbackDetectors,
} from './exerciseCatalog';

type PhonePositionChoice = 'sdkDefault' | 'floor' | 'elevated';
type TriStateChoice = 'sdkDefault' | 'on' | 'off';
type AddTarget = 'workout' | 'continuation';

type BuiltWorkoutExercise = {
  id: number;
  detector: string;
  duration: number;
  phonePositionChoice: PhonePositionChoice;
  guidanceChoice: TriStateChoice;
  wideAngleChoice: TriStateChoice;
  shortIntro: boolean;
  playPreExerciseCountdown: boolean;
  playRepMilestoneVoice: boolean;
  repMilestoneInterval: number;
  playSoundOnEachRep: boolean;
  playTargetRepsCompletionVoice: boolean;
  intentVoiceFeedbackEnabled: boolean;
  showTargetProgress: boolean;
  adaptiveRomFeedbackEnabled: boolean;
  adaptiveRomWarmupReps: number;
  stretchSetEnabled: boolean;
  stretchSetRepetitions: number;
  stretchSetSeconds: number;
  stretchSetRestSeconds: number;
  positionRepsEnabled: boolean;
  positionRepTargetReps: number;
  positionRepSecondsPerRep: number;
};

type Props = {
  settings: DemoSettings;
  onChangeSettings: (settings: DemoSettings) => void;
  onBack: () => void;
  onResult: (summary: string) => void;
};

const PHONE_POSITION_OPTIONS: PhonePositionChoice[] = [
  'sdkDefault',
  'floor',
  'elevated',
];
const TRI_STATE_OPTIONS: TriStateChoice[] = ['sdkDefault', 'on', 'off'];

const WorkoutBuilderScreen = ({
  settings,
  onChangeSettings,
  onBack,
  onResult,
}: Props) => {
  const [search, setSearch] = useState('');
  const [availableDetectors, setAvailableDetectors] = useState<string[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<Record<string, string>>(
    {},
  );
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [workoutExercises, setWorkoutExercises] = useState<
    BuiltWorkoutExercise[]
  >([]);
  const [continuationExercises, setContinuationExercises] = useState<
    BuiltWorkoutExercise[]
  >([]);
  const [nextId, setNextId] = useState(1);
  const [addTarget, setAddTarget] = useState<AddTarget>('workout');
  const [editing, setEditing] = useState<{
    exercise: BuiltWorkoutExercise;
    owner: AddTarget;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const nativeMovements = await getSupportedMovements();
        const detectors = (
          nativeMovements.length ? nativeMovements : fallbackDetectors
        )
          .filter(detector => detector.toLowerCase() !== 'rowing')
          .filter(
            (detector, index, source) => source.indexOf(detector) === index,
          )
          .sort((a, b) =>
            displayNameForDetector(a).localeCompare(displayNameForDetector(b)),
          );
        if (active) {
          setAvailableDetectors(detectors);
        }
      } catch {
        if (active) {
          setAvailableDetectors(fallbackDetectors);
        }
      } finally {
        if (active) {
          setLoadingExercises(false);
        }
      }
    };
    load().catch(() => {
      if (active) {
        setAvailableDetectors(fallbackDetectors);
        setLoadingExercises(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredDetectors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return availableDetectors;
    }
    return availableDetectors.filter(
      detector =>
        detector.toLowerCase().includes(query) ||
        displayNameForDetector(detector).toLowerCase().includes(query),
    );
  }, [availableDetectors, search]);

  const updateSettings = (patch: Partial<DemoSettings>) => {
    onChangeSettings({ ...settings, ...patch });
  };

  const addDetector = async (detector: string) => {
    const exercise = createExercise(nextId, detector);
    setNextId(value => value + 1);
    if (settings.enableWorkoutContinuation && addTarget === 'continuation') {
      setContinuationExercises(items => [...items, exercise]);
    } else {
      setWorkoutExercises(items => [...items, exercise]);
    }

    if (Platform.OS === 'ios' && !exerciseTypes[detector]) {
      try {
        const type = await getExerciseType(detector);
        if (type) {
          setExerciseTypes(current => ({ ...current, [detector]: type }));
        }
      } catch {
        // The builder remains usable when a detector has no native type mapping.
      }
    }
  };

  const startBuiltWorkout = async () => {
    if (workoutExercises.length === 0) {
      return;
    }
    try {
      await applyDemoSettings(settings);
      const continuation =
        settings.enableWorkoutContinuation && continuationExercises.length > 0
          ? new SMWorkoutLibrary.WorkoutContinuation(
              '',
              continuationExercises.map((exercise, index) =>
                toNativeExercise(exercise, index, settings),
              ),
              null,
            )
          : null;
      const workout = new SMWorkoutLibrary.SMWorkout(
        'built-workout',
        'Built Workout',
        null,
        null,
        workoutExercises.map((exercise, index) =>
          toNativeExercise(exercise, index, settings),
        ),
        null,
        null,
        null,
        continuation,
        { exportInternalInsights: settings.exportAssessmentInsights },
      );
      const result = await startCustomWorkout(
        workout,
        buildModifications(settings),
      );
      onResult(result.summary || JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Unable to start built workout', String(error));
    }
  };

  const saveExercise = (updated: BuiltWorkoutExercise, owner: AddTarget) => {
    const updateList = (items: BuiltWorkoutExercise[]) =>
      items.map(item => (item.id === updated.id ? updated : item));
    if (owner === 'workout') {
      setWorkoutExercises(updateList);
    } else {
      setContinuationExercises(updateList);
    }
    setEditing(null);
  };

  if (editing) {
    return (
      <ExerciseEditorScreen
        exercise={editing.exercise}
        onCancel={() => setEditing(null)}
        onDone={updated => saveExercise(updated, editing.owner)}
      />
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Pressable onPress={onBack} style={s.headerButton}>
          <Text style={s.headerButtonText}>Back</Text>
        </Pressable>
        <Text style={s.headerTitle}>Build Workout</Text>
        <Pressable
          onPress={startBuiltWorkout}
          disabled={workoutExercises.length === 0}
          style={s.headerButton}
        >
          <Text
            style={[
              s.headerButtonText,
              workoutExercises.length === 0 && s.disabledText,
            ]}
          >
            Start
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search SDK exercises"
          placeholderTextColor="#8E8E93"
        />

        <ToggleRow
          label="Enable workout continuation"
          value={settings.enableWorkoutContinuation}
          onValueChange={enableWorkoutContinuation => {
            if (!enableWorkoutContinuation) {
              setAddTarget('workout');
            }
            updateSettings({ enableWorkoutContinuation });
          }}
        />

        {settings.enableWorkoutContinuation && (
          <ChoiceRow
            label="Add target"
            value={addTarget}
            options={['workout', 'continuation']}
            onChange={setAddTarget}
          />
        )}

        <SelectedSection
          title="Workout"
          items={workoutExercises}
          exerciseTypes={exerciseTypes}
          emptyText="Add at least one exercise to enable Start."
          onEdit={exercise => setEditing({ exercise, owner: 'workout' })}
          onMove={(from, to) =>
            setWorkoutExercises(items => moveItem(items, from, to))
          }
          onRemove={index =>
            setWorkoutExercises(items => items.filter((_, i) => i !== index))
          }
        />

        {settings.enableWorkoutContinuation && (
          <SelectedSection
            title="Continuation"
            items={continuationExercises}
            exerciseTypes={exerciseTypes}
            emptyText="Continuation exercises run when continuation is enabled."
            onEdit={exercise => setEditing({ exercise, owner: 'continuation' })}
            onMove={(from, to) =>
              setContinuationExercises(items => moveItem(items, from, to))
            }
            onRemove={index =>
              setContinuationExercises(items =>
                items.filter((_, i) => i !== index),
              )
            }
          />
        )}

        <View style={s.sectionHeaderRow}>
          <Text style={s.sectionTitle}>Available exercises</Text>
          {(workoutExercises.length > 0 ||
            continuationExercises.length > 0) && (
            <Pressable
              onPress={() => {
                setWorkoutExercises([]);
                setContinuationExercises([]);
              }}
            >
              <Text style={s.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {loadingExercises ? (
          <ActivityIndicator size="large" color="#007AFF" style={s.loader} />
        ) : filteredDetectors.length === 0 ? (
          <Text style={s.emptyText}>No supported movements found.</Text>
        ) : (
          filteredDetectors.map(detector => (
            <Pressable
              key={detector}
              style={s.exerciseRow}
              onPress={() => addDetector(detector)}
            >
              <View style={s.addCircle}>
                <Text style={s.addCircleText}>+</Text>
              </View>
              <View style={s.flexOne}>
                <Text style={s.exerciseTitle}>
                  {displayNameForDetector(detector)}
                </Text>
                <Text style={s.exerciseSubtitle}>{detector}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ExerciseEditorScreen = ({
  exercise,
  onCancel,
  onDone,
}: {
  exercise: BuiltWorkoutExercise;
  onCancel: () => void;
  onDone: (exercise: BuiltWorkoutExercise) => void;
}) => {
  const [draft, setDraft] = useState<BuiltWorkoutExercise>(() => ({
    ...exercise,
  }));
  const update = (patch: Partial<BuiltWorkoutExercise>) =>
    setDraft(value => ({ ...value, ...patch }));

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Pressable onPress={onCancel} style={s.headerButton}>
          <Text style={s.headerButtonText}>Back</Text>
        </Pressable>
        <Text style={s.headerTitle} numberOfLines={1}>
          {displayNameForDetector(draft.detector)}
        </Text>
        <Pressable onPress={() => onDone(draft)} style={s.headerButton}>
          <Text style={s.headerButtonText}>Done</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.detectorText}>Detector: {draft.detector}</Text>
        <NumberRow
          label="Duration"
          value={draft.duration}
          min={5}
          max={300}
          step={5}
          suffix="s"
          onChange={duration => update({ duration })}
        />
        <ChoiceRow
          label="Phone position"
          value={draft.phonePositionChoice}
          options={PHONE_POSITION_OPTIONS}
          onChange={phonePositionChoice => update({ phonePositionChoice })}
        />
        <ChoiceRow
          label="Guidance mode"
          value={draft.guidanceChoice}
          options={TRI_STATE_OPTIONS}
          onChange={guidanceChoice => update({ guidanceChoice })}
        />
        {Platform.OS === 'ios' && (
          <ChoiceRow
            label="Wide angle camera"
            value={draft.wideAngleChoice}
            options={TRI_STATE_OPTIONS}
            onChange={wideAngleChoice => update({ wideAngleChoice })}
          />
        )}
        <ToggleRow
          label="Short intro"
          value={draft.shortIntro}
          onValueChange={shortIntro => update({ shortIntro })}
        />
        <ToggleRow
          label="Pre-exercise countdown"
          value={draft.playPreExerciseCountdown}
          onValueChange={playPreExerciseCountdown =>
            update({ playPreExerciseCountdown })
          }
        />
        <ToggleRow
          label="Rep milestone voice"
          value={draft.playRepMilestoneVoice}
          onValueChange={playRepMilestoneVoice =>
            update({ playRepMilestoneVoice })
          }
        />
        <ChoiceRow
          label="Milestone interval"
          value={String(draft.repMilestoneInterval)}
          options={['10', '5']}
          onChange={repMilestoneInterval =>
            update({ repMilestoneInterval: Number(repMilestoneInterval) })
          }
          labelFor={option => `${option} reps`}
        />
        <ToggleRow
          label="Sound on each rep"
          value={draft.playSoundOnEachRep}
          onValueChange={playSoundOnEachRep => update({ playSoundOnEachRep })}
        />
        {Platform.OS === 'android' && (
          <>
            <ToggleRow
              label="Target-reps completion voice"
              value={draft.playTargetRepsCompletionVoice}
              onValueChange={playTargetRepsCompletionVoice =>
                update({ playTargetRepsCompletionVoice })
              }
            />
            <ToggleRow
              label="Intent voice feedback"
              value={draft.intentVoiceFeedbackEnabled}
              onValueChange={intentVoiceFeedbackEnabled =>
                update({ intentVoiceFeedbackEnabled })
              }
            />
            <ToggleRow
              label="Show target progress"
              value={draft.showTargetProgress}
              onValueChange={showTargetProgress => update({ showTargetProgress })}
            />
          </>
        )}
        <ToggleRow
          label="Adaptive ROM feedback"
          value={draft.adaptiveRomFeedbackEnabled}
          onValueChange={adaptiveRomFeedbackEnabled =>
            update({ adaptiveRomFeedbackEnabled })
          }
        />
        <NumberRow
          label="Adaptive warmup reps"
          value={draft.adaptiveRomWarmupReps}
          min={1}
          max={5}
          step={1}
          onChange={adaptiveRomWarmupReps => update({ adaptiveRomWarmupReps })}
        />

        {Platform.OS === 'android' && (
          <>
            <Text style={s.sectionTitle}>Position reps</Text>
            <ToggleRow
              label="Enable position reps"
              value={draft.positionRepsEnabled}
              onValueChange={positionRepsEnabled => update({ positionRepsEnabled })}
            />
            {draft.positionRepsEnabled && (
              <>
                <NumberRow
                  label="Position target reps"
                  value={draft.positionRepTargetReps}
                  min={1}
                  max={20}
                  step={1}
                  onChange={positionRepTargetReps =>
                    update({ positionRepTargetReps })
                  }
                />
                <NumberRow
                  label="Seconds per position rep"
                  value={draft.positionRepSecondsPerRep}
                  min={1}
                  max={60}
                  step={1}
                  suffix="s"
                  onChange={positionRepSecondsPerRep =>
                    update({ positionRepSecondsPerRep })
                  }
                />
              </>
            )}
          </>
        )}

        <Text style={s.sectionTitle}>Stretch set</Text>
        <ToggleRow
          label="Enable stretch set"
          value={draft.stretchSetEnabled}
          onValueChange={stretchSetEnabled => update({ stretchSetEnabled })}
        />
        <NumberRow
          label="Stretch repetitions"
          value={draft.stretchSetRepetitions}
          min={1}
          max={10}
          step={1}
          onChange={stretchSetRepetitions => update({ stretchSetRepetitions })}
        />
        <NumberRow
          label="Seconds per stretch"
          value={draft.stretchSetSeconds}
          min={3}
          max={60}
          step={1}
          suffix="s"
          onChange={stretchSetSeconds => update({ stretchSetSeconds })}
        />
        <NumberRow
          label="Rest between stretches"
          value={draft.stretchSetRestSeconds}
          min={0}
          max={30}
          step={1}
          suffix="s"
          onChange={stretchSetRestSeconds => update({ stretchSetRestSeconds })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const SelectedSection = ({
  title,
  items,
  exerciseTypes,
  emptyText,
  onEdit,
  onMove,
  onRemove,
}: {
  title: string;
  items: BuiltWorkoutExercise[];
  exerciseTypes: Record<string, string>;
  emptyText: string;
  onEdit: (exercise: BuiltWorkoutExercise) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) => (
  <View style={s.selectedSection}>
    <Text style={s.sectionTitle}>
      {title} ({items.length})
    </Text>
    {items.length === 0 ? (
      <Text style={s.emptyText}>{emptyText}</Text>
    ) : (
      items.map((item, index) => (
        <Pressable
          key={item.id}
          style={s.selectedRow}
          onPress={() => onEdit(item)}
        >
          <Text style={s.selectedIndex}>{index + 1}.</Text>
          <View style={s.flexOne}>
            <Text style={s.exerciseTitle}>
              {displayNameForDetector(item.detector)}
            </Text>
            <Text style={s.exerciseSubtitle}>
              {exerciseSummary(item, exerciseTypes[item.detector])}
            </Text>
          </View>
          <View style={s.rowActions}>
            <ActionButton
              label="Up"
              disabled={index === 0}
              onPress={() => onMove(index, index - 1)}
            />
            <ActionButton
              label="Down"
              disabled={index === items.length - 1}
              onPress={() => onMove(index, index + 1)}
            />
            <ActionButton label="Remove" onPress={() => onRemove(index)} />
          </View>
        </Pressable>
      ))
    )}
  </View>
);

const ActionButton = ({
  label,
  disabled = false,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[s.actionButton, disabled && s.actionButtonDisabled]}
  >
    <Text style={s.actionButtonText}>{label}</Text>
  </Pressable>
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
  labelFor,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
}) => (
  <View style={s.optionBlock}>
    <Text style={s.optionLabel}>{label}</Text>
    <View style={s.chipWrap}>
      {options.map(option => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            style={[s.chip, selected && s.chipSelected]}
            onPress={() => onChange(option)}
          >
            <Text style={[s.chipText, selected && s.chipTextSelected]}>
              {labelFor?.(option) ?? displayName(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const NumberRow = ({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) => {
  const nextValue = (next: number) => Math.max(min, Math.min(max, next));
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={s.stepper}>
        <Pressable
          style={[s.stepperButton, value <= min && s.stepperButtonDisabled]}
          disabled={value <= min}
          onPress={() => onChange(nextValue(value - step))}
        >
          <Text style={s.stepperText}>-</Text>
        </Pressable>
        <Text style={s.stepperValue}>{`${value}${
          suffix ? ` ${suffix}` : ''
        }`}</Text>
        <Pressable
          style={[s.stepperButton, value >= max && s.stepperButtonDisabled]}
          disabled={value >= max}
          onPress={() => onChange(nextValue(value + step))}
        >
          <Text style={s.stepperText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createExercise = (
  id: number,
  detector: string,
): BuiltWorkoutExercise => ({
  id,
  detector,
  duration: EXERCISE_CATALOG[detector]?.defaultDuration ?? 20,
  phonePositionChoice: 'sdkDefault',
  guidanceChoice: 'sdkDefault',
  wideAngleChoice: 'sdkDefault',
  shortIntro: false,
  playPreExerciseCountdown: false,
  playRepMilestoneVoice: false,
  repMilestoneInterval: 10,
  playSoundOnEachRep: false,
  playTargetRepsCompletionVoice: false,
  intentVoiceFeedbackEnabled: false,
  showTargetProgress: false,
  adaptiveRomFeedbackEnabled: false,
  adaptiveRomWarmupReps: 2,
  stretchSetEnabled: false,
  stretchSetRepetitions: 3,
  stretchSetSeconds: 8,
  stretchSetRestSeconds: 4,
  positionRepsEnabled: false,
  positionRepTargetReps: 3,
  positionRepSecondsPerRep: 5,
});

const toNativeExercise = (
  exercise: BuiltWorkoutExercise,
  index: number,
  settings: DemoSettings,
) => {
  const entry = EXERCISE_CATALOG[exercise.detector];
  const uiElements = entry?.uiElements ?? [
    SMWorkoutLibrary.UIElement.Timer,
    SMWorkoutLibrary.UIElement.RepsCounter,
  ];
  const supportsTargetReps =
    uiElements.includes(SMWorkoutLibrary.UIElement.RepsCounter) &&
    !uiElements.includes(SMWorkoutLibrary.UIElement.GaugeOfMotion);
  const options: Record<string, unknown> = {
    shortIntro: exercise.shortIntro,
    playPreExerciseCountdown: exercise.playPreExerciseCountdown,
    playRepMilestoneVoice: exercise.playRepMilestoneVoice,
    repMilestoneInterval: exercise.repMilestoneInterval,
    playSoundOnEachRep: exercise.playSoundOnEachRep,
    adaptiveRomFeedbackEnabled: exercise.adaptiveRomFeedbackEnabled,
    adaptiveRomWarmupReps: exercise.adaptiveRomWarmupReps,
  };
  const phonePosition = phonePositionValue(exercise.phonePositionChoice);
  const guidanceMode = triStateValue(exercise.guidanceChoice);
  const useWideAngleCamera = triStateValue(exercise.wideAngleChoice);
  if (phonePosition) {
    options.phonePosition = phonePosition;
  }
  if (guidanceMode !== null) {
    options.guidanceMode = guidanceMode;
  }
  if (Platform.OS === 'ios' && useWideAngleCamera !== null) {
    options.useWideAngleCamera = useWideAngleCamera;
  }
  if (exercise.stretchSetEnabled) {
    options.stretchSetConfig = new SMWorkoutLibrary.StretchSetConfig(
      exercise.stretchSetRepetitions,
      exercise.stretchSetSeconds,
      { restSecondsBetweenStretches: exercise.stretchSetRestSeconds },
    );
  }
  if (Platform.OS === 'android') {
    options.playTargetRepsCompletionVoice =
      exercise.playTargetRepsCompletionVoice;
    options.intentVoiceFeedbackEnabled = exercise.intentVoiceFeedbackEnabled;
    options.enableGuidanceModeSuggestion = settings.guidanceModeSuggestion;
    options.enableSmallBodyPartFocus = settings.smallBodyPartFocus;
    options.showTargetProgress =
      exercise.showTargetProgress && supportsTargetReps;
    options.internalInsightsKey = exercise.detector;
    if (exercise.positionRepsEnabled) {
      options.positionRepConfig = new SMWorkoutLibrary.PositionRepConfig(
        exercise.positionRepTargetReps,
        exercise.positionRepSecondsPerRep,
      );
    }
    if (settings.exerciseProgressDisplay && exercise.detector !== 'Rest') {
      options.displayContext = createDisplayContext(index);
    }
  }

  const scoringParams =
    Platform.OS === 'android' &&
    exercise.showTargetProgress &&
    supportsTargetReps
      ? new SMWorkoutLibrary.SMScoringParams(
          SMWorkoutLibrary.ScoringType.Reps,
          1,
          null,
          10,
          null,
          null,
        )
      : null;

  return new SMWorkoutLibrary.SMExercise(
    displayNameForDetector(exercise.detector),
    exercise.duration,
    entry?.videoInstruction ?? `${exercise.detector}InstructionVideo`,
    null,
    uiElements,
    exercise.detector,
    null,
    scoringParams,
    options,
  );
};

const createDisplayContext = (index: number) => {
  if (index < 2) {
    return new SMWorkoutLibrary.ExerciseDisplayContext({
      sectionTitle: 'WARM-UP',
      playsTitleSound: true,
    });
  }
  const circuitNumber = Math.floor((index - 2) / 3) + 1;
  return new SMWorkoutLibrary.ExerciseDisplayContext({
    sectionTitle: 'MAIN SET',
    playsTitleSound: true,
    group: new SMWorkoutLibrary.ExerciseDisplayGroup(
      `demo-circuit-${circuitNumber}`,
      SMWorkoutLibrary.ExerciseDisplayGroupKind.Circuit,
      circuitNumber,
    ),
  });
};

const phonePositionValue = (choice: PhonePositionChoice) => {
  if (choice === 'floor') {
    return SMWorkoutLibrary.PhonePosition.Floor;
  }
  if (choice === 'elevated') {
    return SMWorkoutLibrary.PhonePosition.Elevated;
  }
  return null;
};

const triStateValue = (choice: TriStateChoice) => {
  if (choice === 'on') {
    return true;
  }
  if (choice === 'off') {
    return false;
  }
  return null;
};

const moveItem = <T,>(items: T[], from: number, to: number) => {
  if (to < 0 || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const exerciseSummary = (
  exercise: BuiltWorkoutExercise,
  exerciseType?: string,
) => {
  const parts = [`${exercise.duration}s`];
  if (exerciseType) {
    parts.push(displayName(exerciseType));
  }
  if (exercise.shortIntro) {
    parts.push('short intro');
  }
  if (exercise.guidanceChoice !== 'sdkDefault') {
    parts.push(
      `guidance ${displayName(exercise.guidanceChoice).toLowerCase()}`,
    );
  }
  if (exercise.adaptiveRomFeedbackEnabled) {
    parts.push('adaptive ROM');
  }
  if (exercise.showTargetProgress) {
    parts.push('target progress');
  }
  if (exercise.positionRepsEnabled) {
    parts.push('position reps');
  }
  if (exercise.stretchSetEnabled) {
    parts.push('stretch set');
  }
  return parts.join(' | ');
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerButton: { minWidth: 58, paddingHorizontal: 8, paddingVertical: 6 },
  headerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerTitle: {
    color: '#fff',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabledText: { opacity: 0.45 },
  content: { padding: 16, paddingBottom: 40 },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#C7C7CC',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    color: '#000',
    fontSize: 15,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    marginBottom: 8,
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
  selectedSection: { marginTop: 18 },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  sectionTitle: {
    color: '#111',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  clearText: { color: '#007AFF', fontSize: 15, fontWeight: '700' },
  emptyText: { color: '#6C6C70', fontSize: 14, marginBottom: 8 },
  selectedRow: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedIndex: { color: '#6C6C70', fontSize: 14, marginRight: 10, width: 24 },
  rowActions: { flexDirection: 'row', gap: 4, marginLeft: 8 },
  actionButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  actionButtonDisabled: { opacity: 0.35 },
  actionButtonText: { color: '#007AFF', fontSize: 11, fontWeight: '700' },
  exerciseRow: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#D1D1D6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  addCircle: {
    alignItems: 'center',
    borderColor: '#007AFF',
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  addCircleText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  exerciseTitle: { color: '#000', fontSize: 15, fontWeight: '600' },
  exerciseSubtitle: { color: '#6C6C70', fontSize: 12, marginTop: 2 },
  loader: { marginTop: 18 },
  flexOne: { flex: 1 },
  detectorText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
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
    minWidth: 58,
    textAlign: 'center',
  },
});

export default WorkoutBuilderScreen;
