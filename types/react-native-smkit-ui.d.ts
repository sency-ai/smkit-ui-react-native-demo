declare module '@sency/react-native-smkit-ui' {
  export namespace SMWorkoutLibrary {
    export enum AssessmentTypes {
      Fitness = 'fitness',
      Custom = 'custom',
      Body360 = 'body360',
      Cardio = 'cardio',
      Strength = 'strength',
    }

    export enum PauseType {
      Resume = 'resume',
      Skip = 'skip',
      StartOver = 'startOver',
      Quit = 'quit',
      Rest = 'rest',
      Switch = 'switchExercise',
    }

    export enum UIElement {
      RepsCounter = 'repsCounter',
      Timer = 'timer',
      GaugeOfMotion = 'gaugeOfMotion',
      Skeleton = 'skeleton',
      HoldingPosition = 'holdingPosition',
      CountdownTimer = 'countdownTimer',
      QuickMotion = 'quickMotion',
    }

    export enum BodyZone {
      UpperBody = 'UpperBody',
      LowerBody = 'LowerBody',
      FullBody = 'FullBody',
    }

    export enum WorkoutDifficulty {
      LowDifficulty = 'LowDifficulty',
      MidDifficulty = 'MidDifficulty',
      HighDifficulty = 'HighDifficulty',
    }

    export enum WorkoutDuration {
      Short = 'Short',
      Long = 'Long',
    }

    export enum ScoringType {
      Rom = 'rom',
      Time = 'time',
      Reps = 'reps',
    }

    export enum Language {
      English = 'en',
      Hebrew = 'he',
    }

    export enum CounterPreferences {
      Default = 'Default',
      PerfectOnly = 'PerfectOnly',
    }

    export enum EndExercisePreferences {
      Default = 'Default',
      TargetBased = 'TargetBased',
    }

    export enum ColorTheme {
      Blue = 'blue',
      Green = 'green',
      Purple = 'purple',
      Orange = 'orange',
      Silver = 'silver',
      Gold = 'gold',
      Pink = 'pink',
    }

    export enum PhonePosition {
      Floor = 'floor',
      Elevated = 'elevated',
    }

    export enum SkeletonPreset {
      Default = 'defaultPreset',
      MinimalDots = 'minimalDots',
      ThinOutline = 'thinOutline',
      MonochromeClean = 'monochromeClean',
      NeonGlow = 'neonGlow',
      BoldHighlight = 'boldHighlight',
      SoftFill = 'softFill',
      Wireframe = 'wireframe',
      HighContrast = 'highContrast',
      Pastel = 'pastel',
      DarkOutline = 'darkOutline',
      MinimalLine = 'minimalLine',
      DoubleStroke = 'doubleStroke',
      GradientReady = 'gradientReady',
      SubtleShadow = 'subtleShadow',
      Classic = 'classic',
      Athletic = 'athletic',
      Premium = 'premium',
      Hologram = 'hologram',
      Matte = 'matte',
      NeonPulse = 'neonPulse',
      OutlineOnly = 'outlineOnly',
      Slim = 'slim',
      Thick = 'thick',
      Studio = 'studio',
      Accessibility = 'accessibility',
    }

    export enum SkeletonConnectionStyle {
      None = 'none',
      Dotted = 'dotted',
      Dashed = 'dashed',
      Solid = 'solid',
      LongDashed = 'longDashed',
      ThinDots = 'thinDots',
      DotDashed = 'dotDashed',
      Rounded = 'rounded',
    }

    export enum SkeletonJointShape {
      Circle = 'circle',
      Square = 'square',
      Triangle = 'triangle',
      Diamond = 'diamond',
      Star = 'star',
      Hexagon = 'hexagon',
    }

    export enum SkeletonColorOption {
      White = 'white',
      Black = 'black',
      Red = 'red',
      Blue = 'blue',
      Green = 'green',
      Yellow = 'yellow',
      Orange = 'orange',
      Purple = 'purple',
      Gray = 'gray',
      Cyan = 'cyan',
      LightGray = 'lightGray',
      DarkGray = 'darkGray',
      OffWhite = 'offWhite',
      Charcoal = 'charcoal',
      LightBlue = 'lightBlue',
      DarkBlue = 'darkBlue',
      LightGreen = 'lightGreen',
      DarkGreen = 'darkGreen',
      LightPurple = 'lightPurple',
      DarkPurple = 'darkPurple',
      Gold = 'gold',
      DarkGold = 'darkGold',
      LightPink = 'lightPink',
      DarkPink = 'darkPink',
      MediumGray = 'mediumGray',
      Silver = 'silver',
      Navy = 'navy',
      ForestGreen = 'forestGreen',
      Lavender = 'lavender',
      RosePink = 'rosePink',
    }

    export type SkeletonConfig = {
      hidden?: boolean;
      preset?: SkeletonPreset;
      connectionStyle?: SkeletonConnectionStyle;
      jointShape?: SkeletonJointShape;
      dotsOpacity?: number;
      connectionsOpacity?: number;
      dotsInnerColor?: SkeletonColorOption;
      dotsOuterColor?: SkeletonColorOption;
      connectionsInnerColor?: SkeletonColorOption;
      connectionsOuterColor?: SkeletonColorOption;
      dotsGlow?: number;
      connectionsGlow?: number;
      lineWidthScale?: number;
      outlineScale?: number;
      softness?: number;
      animationDuration?: number;
    };

    export type ExerciseOptions = {
      shortIntro?: boolean;
      phonePosition?: PhonePosition | null;
      guidanceMode?: boolean | null;
      useWideAngleCamera?: boolean | null;
      playPreExerciseCountdown?: boolean;
      playRepMilestoneVoice?: boolean;
      repMilestoneInterval?: number;
      playSoundOnEachRep?: boolean;
      adaptiveRomFeedbackEnabled?: boolean;
      adaptiveRomWarmupReps?: number;
      stretchSetConfig?: StretchSetConfig | null;
    };

    export class StretchSetConfig {
      constructor(
        repetitions: number,
        secondsPerStretch: number,
        options?: {
          enabled?: boolean;
          restSecondsBetweenStretches?: number;
          introSoundKey?: string | null;
          positionDetectors?: string[] | null;
        },
      );
    }

    export class SMScoringParams {
      constructor(
        type: ScoringType | null,
        scoreFactor: number | null,
        targetTime: number | null,
        targetReps: number | null,
        targetRom: string | null,
        passCriteria: string[] | null,
      );
    }

    export class SMExercise {
      constructor(
        prettyName: string | null,
        totalSeconds: number | null,
        videoInstruction: string | null,
        exerciseIntro: string | null,
        uiElements: UIElement[] | null,
        detector: string,
        exerciseClosure: string | null,
        scoringParams: SMScoringParams | null,
        options?: ExerciseOptions,
      );
    }

    export class SMAssessmentExercise extends SMExercise {
      constructor(
        prettyName: string | null,
        totalSeconds: number | null,
        videoInstruction: string | null,
        exerciseIntro: string | null,
        uiElements: UIElement[] | null,
        detector: string,
        exerciseClosure: string | null,
        scoringParams: SMScoringParams | null,
        closureFailedSound: string | null,
        summaryTitle: string | null,
        summarySubTitle: string | null,
        summaryMainMetricTitle: string | null,
        summaryMainMetricSubTitle: string | null,
        options?: ExerciseOptions,
      );
    }

    export class WorkoutContinuation {
      constructor(
        interactionUnlockSoundKey: string,
        exercises: SMExercise[],
        introSoundKey?: string | null,
      );
    }

    export class SMWorkout {
      constructor(
        id: string | null,
        name: string | null,
        workoutIntro: string | null,
        soundtrack: string | null,
        exercises: SMExercise[],
        getInFrame: string | null,
        bodycalFinished: string | null,
        workoutClosure: string | null,
        continuation?: WorkoutContinuation | null,
      );
    }

    export class WorkoutConfig {
      constructor(
        week: number,
        bodyZone: BodyZone,
        difficultyLevel: WorkoutDifficulty,
        workoutDuration: WorkoutDuration,
        language: Language,
        programID: string,
        options?: {
          phonePosition?: PhonePosition;
          shortIntro?: boolean;
        },
      );
    }
  }

  export function configure(key: string): Promise<string>;
  export function startAssessment(
    type: SMWorkoutLibrary.AssessmentTypes,
    showSummary: boolean,
    userData: unknown | null,
    forceShowUserDataScreen: boolean,
    customAssessmentID: string,
    modifications: string | null,
  ): Promise<{ summary: string; didFinish: boolean }>;
  export function startCustomWorkout(
    workout: SMWorkoutLibrary.SMWorkout,
    modifications: string | null,
  ): Promise<{ summary: string; didFinish: boolean }>;
  export function startCustomAssessment(
    assessment: SMWorkoutLibrary.SMWorkout,
    userData: unknown | null,
    forceShowUserDataScreen: boolean,
    showSummary: boolean,
    modifications: string | null,
  ): Promise<{ summary: string; didFinish: boolean }>;
  export function startWorkoutProgram(
    workoutConfig: SMWorkoutLibrary.WorkoutConfig,
    modifications: string | null,
  ): Promise<{ summary: string; didFinish: boolean }>;
  export function setSessionLanguage(
    language: SMWorkoutLibrary.Language,
  ): Promise<void>;
  export function setPhoneCalibrationLanguage(
    language: SMWorkoutLibrary.Language,
  ): Promise<void>;
  export function setEndExercisePreferences(
    endExercisePreferences: SMWorkoutLibrary.EndExercisePreferences,
  ): Promise<void>;
  export function setCounterPreferences(
    counterPreferences: SMWorkoutLibrary.CounterPreferences,
  ): Promise<void>;
  export function setIntelligenceRestEnabled(enabled: boolean): Promise<void>;
  export function setInstructionVideoConfig(config: {
    displayMode: string;
    mediumSizeCycles?: number;
  }): Promise<void>;
  export function setSkeletonSettings(
    config: SMWorkoutLibrary.SkeletonConfig,
  ): Promise<void>;
  export function setPauseTypes(
    types: SMWorkoutLibrary.PauseType[],
  ): Promise<void>;
  export function setAllowAudioMixing(enabled: boolean): Promise<void>;
  export function setShowExternalAudioControl(enabled: boolean): Promise<void>;
  export function setAccuratePoseEstimation(enabled: boolean): Promise<void>;
  export function setColorTheme(
    theme: SMWorkoutLibrary.ColorTheme | string,
  ): Promise<void>;
  export function setPlayPhoneCalibrationAudio(enabled: boolean): Promise<void>;
  export function setPlayBodyCalibrationAudio(enabled: boolean): Promise<void>;
  export function setStartTimerOnFirstActivity(enabled: boolean): Promise<void>;
  export function setWorkoutContinuationTimerDuration(
    seconds: number,
  ): Promise<void>;
  export function setPhoneMovementCountPreventionEnabled(
    enabled: boolean,
  ): Promise<void>;
  export function setVariationMismatchFeedbackEnabled(
    enabled: boolean,
  ): Promise<void>;
  export function setUseDefaultGuidanceMode(enabled: boolean): Promise<void>;
  export function setGuidanceDebugLogging(enabled: boolean): Promise<void>;
  export function setEnableButtonTutorial(enabled: boolean): Promise<void>;
  export function setConfigString(configString: string | null): Promise<void>;
  export function getSupportedMovements(): Promise<string[]>;
}
