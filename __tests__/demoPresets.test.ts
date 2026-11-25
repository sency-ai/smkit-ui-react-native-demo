import { SMWorkoutLibrary } from '@sency/react-native-smkit-ui';
import { exampleWorkout, mobilityFlowWorkout } from '../components/demoPresets';

const { UIElement } = SMWorkoutLibrary;

test('Mobility Flow holds each block for one 10-second rep', () => {
  const workout = mobilityFlowWorkout();
  expect(workout.name).toBe('Mobility Flow');
  expect(workout.exercises).toHaveLength(1);
  const [flow] = workout.exercises;
  expect(flow.detector).toBe('MobilityFlow');
  expect(flow.options.mobilityFlowConfig).toEqual({
    blocks: [
      { detector: 'RhomboidStretch', repetitions: 1, secondsPerRep: 10 },
      {
        detector: 'SeatedThoracicSideBendingLeft',
        repetitions: 1,
        secondsPerRep: 10,
      },
      {
        detector: 'SeatedThoracicSideBendingRight',
        repetitions: 1,
        secondsPerRep: 10,
      },
    ],
  });
  expect(() => JSON.parse(workout.toJson())).not.toThrow();
});

test('Example workout runs the six showcase exercises in order', () => {
  const workout = exampleWorkout();
  const exercises = workout.exercises;
  expect(workout.name).toBe('Example workout');
  expect(
    exercises.map(({ detector, totalSeconds, uiElements }) => [
      detector,
      totalSeconds,
      uiElements,
    ]),
  ).toEqual([
    ['ArnoldShoulderPress', 40, [UIElement.Timer, UIElement.RepsCounter]],
    ['JeffersonCurl', 45, [UIElement.Timer, UIElement.GaugeOfMotion]],
    ['Combo01', 60, [UIElement.RepsCounter, UIElement.Timer]],
    [
      'TherapySquat',
      45,
      [UIElement.Timer, UIElement.RepsCounter, UIElement.GaugeOfMotion],
    ],
    ['PushupRegular', 40, [UIElement.RepsCounter, UIElement.Timer]],
    [
      'StandingBowArrowThoracicMobilityRight',
      60,
      [UIElement.RepsCounter, UIElement.Timer],
    ],
  ]);

  for (const exercise of exercises) {
    expect(exercise.options).toMatchObject({
      adaptiveRomFeedbackEnabled: true,
      enableGuidanceModeSuggestion: true,
      playRepMilestoneVoice: true,
      repMilestoneInterval: 5,
      playPreExerciseCountdown: true,
    });
    expect(exercise.videoInstruction).toBe(
      exercise.detector === 'Combo01' ? null : exercise.detector,
    );
  }

  const [, jefferson, combo, , pushups, bowArrow] = exercises;
  expect(jefferson.options.guidanceMode).toBe(true);
  expect(combo.options.targetReps).toBe(4);
  expect(combo.options.combinationOptions).toBeUndefined();
  expect(combo.exerciseIntro).toBe('ComboSequenceIntro');
  expect(pushups.options.playSoundOnEachRep).toBe(true);
  expect(bowArrow.options.mobilityRepConfig?.targetReps).toBe(5);
  expect(() => JSON.parse(workout.toJson())).not.toThrow();
});
