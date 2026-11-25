import { SMWorkoutLibrary } from '@sency/react-native-smkit-ui';

const { UIElement } = SMWorkoutLibrary;

const workout = (
  id: string,
  name: string,
  exercises: SMWorkoutLibrary.SMExercise[],
) =>
  new SMWorkoutLibrary.SMWorkout(
    id,
    name,
    null,
    null,
    exercises,
    null,
    null,
    null,
  );

/**
 * One 10-second hold each: rhomboid stretch, then seated thoracic side
 * bending to the left and to the right.
 */
export const mobilityFlowWorkout = () =>
  workout('demo-mobility-flow', 'Mobility Flow', [
    SMWorkoutLibrary.SMExercise.mobilityFlow({
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
    }),
  ]);

const exercise = (
  detector: string,
  name: string,
  seconds: number,
  uiElements: SMWorkoutLibrary.UIElement[],
  options: SMWorkoutLibrary.ExerciseOptions = {},
  {
    // Android resolves instruction videos by detector name; iOS accepts it too.
    video = detector,
    intro = null,
  }: { video?: string | null; intro?: string | null } = {},
) =>
  new SMWorkoutLibrary.SMExercise(
    name,
    seconds,
    video,
    intro,
    uiElements,
    detector,
    null,
    null,
    {
      enableGuidanceModeSuggestion: true,
      adaptiveRomFeedbackEnabled: true,
      playRepMilestoneVoice: true,
      repMilestoneInterval: 5,
      playPreExerciseCountdown: true,
      ...options,
    },
  );

/**
 * Arnold shoulder press, Jefferson curl in guidance mode, Combo01, therapy
 * squats, push-ups and 5 standing bow-and-arrow mobility reps.
 */
export const exampleWorkout = () =>
  workout('demo-showcase', 'Example workout', [
    exercise('ArnoldShoulderPress', 'Arnold Shoulder Press', 40, [
      UIElement.Timer,
      UIElement.RepsCounter,
    ]),
    exercise(
      'JeffersonCurl',
      'Jefferson Curl',
      45,
      [UIElement.Timer, UIElement.GaugeOfMotion],
      { guidanceMode: true },
    ),
    // No combinationOptions: the SDK's default reps per movement.
    exercise(
      'Combo01',
      'Combo01',
      60,
      [UIElement.RepsCounter, UIElement.Timer],
      { targetReps: 4 },
      { video: null, intro: 'ComboSequenceIntro' },
    ),
    exercise('TherapySquat', 'Therapy Squat', 45, [
      UIElement.Timer,
      UIElement.RepsCounter,
      UIElement.GaugeOfMotion,
    ]),
    exercise(
      'PushupRegular',
      'Push-ups',
      40,
      [UIElement.RepsCounter, UIElement.Timer],
      { playSoundOnEachRep: true },
    ),
    exercise(
      'StandingBowArrowThoracicMobilityRight',
      'Standing Bow and Arrow Right',
      60,
      [UIElement.RepsCounter, UIElement.Timer],
      { mobilityRepConfig: new SMWorkoutLibrary.MobilityRepConfig(5) },
    ),
  ]);
