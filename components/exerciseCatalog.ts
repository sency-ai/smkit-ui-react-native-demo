import { SMWorkoutLibrary } from '@sency/react-native-smkit-ui';

export type ExerciseType = 'dynamic' | 'static' | 'mobility' | 'bodyAssessment';

export type ExerciseCatalogEntry = {
  detector: string;
  type: ExerciseType;
  uiElements: SMWorkoutLibrary.UIElement[];
  defaultDuration: number;
  videoInstruction: string;
};

const FALLBACK_DETECTORS = [
  'AirJumpRope',
  'AlternateWindmillToeTouch',
  'BackSuperman',
  'BackSupermanHold',
  'BirdDog',
  'Burpees',
  'ButtKicks',
  'CalfRaises',
  'ClamshellsLeft',
  'ClamshellsRight',
  'Crunches',
  'Froggers',
  'GlutesBridge',
  'HandGrip',
  'HighKnees',
  'JumpingJacks',
  'Jumps',
  'LateralHandRaise',
  'LateralHandRaiseLeft',
  'LateralHandRaiseRight',
  'LateralRaises',
  'LungeFront',
  'LungeFrontAlternate',
  'LungeFrontLeft',
  'LungeFrontRight',
  'LungeJumps',
  'LungeRegularStatic',
  'LungeSide',
  'LungeSideLeft',
  'LungeSideRight',
  'PlankCommando',
  'PlankHighShoulderTaps',
  'PlankHighToeTaps',
  'PlankJacksHigh',
  'PlankLowHipTwist',
  'PlankWalkouts',
  'PushupKnees',
  'PushupRegular',
  'PushupWide',
  'QuadThoraticRotation',
  'QuadThoraticRotationLeft',
  'QuadThoraticRotationRight',
  'ReverseSitToTableTop',
  'SeatedShadowBoxing',
  'ShouldersPress',
  'SideLunge',
  'SideStepJacks',
  'SingleHandOverheadHealDigs',
  'SitToStand',
  'SitupPenguin',
  'SitupRussianTwist',
  'SkaterHops',
  'SkiJumps',
  'Skydivers',
  'SkydiversHold',
  'SquatAndKick',
  'SquatAndRotationJab',
  'SquatAndStep',
  'SquatNarrow',
  'SquatRegular',
  'SquatRegularOverhead',
  'SquatSumo',
  'StandingAlternateToeTouch',
  'StandingBicycleCrunches',
  'StandingObliqueCrunches',
  'ToesRaises',
  'FastMarchRun',
  'PogoJumps',
  'PowerWalkInPlace',
  'QuickFeet',
  'ShoulderCircles',
  'SquatPulsing',
  'AnkleMobilityLeft',
  'AnkleMobilityRight',
  'HamstringMobility',
  'HipExternalRotationLeft',
  'HipExternalRotationRight',
  'HipFlexionLeft',
  'HipFlexionRight',
  'HipInternalRotationLeft',
  'HipInternalRotationRight',
  'InnerThighMobility',
  'JeffersonCurl',
  'LungeSideStaticLeft',
  'LungeSideStaticRight',
  'OverheadMobility',
  'StandingHamstringMobility',
  'StandingKneeRaiseLeft',
  'StandingKneeRaiseRight',
  'StandingSideBendLeft',
  'StandingSideBendRight',
  'CalfStretchLungePositionLeft',
  'CalfStretchLungePositionRight',
  'DownwardDogStretch',
  'GlutesStretchOnTheFloorLeft',
  'GlutesStretchOnTheFloorRight',
  'GroinAndAdductor',
  'HappyBaby',
  'HipExternalRotationFigureFourStretchLeft',
  'HipExternalRotationFigureFourStretchRight',
  'HipFlexorLungeStretchLeft',
  'HipFlexorLungeStretchRight',
  'HipFlexorStretchLeft',
  'HipFlexorStretchRight',
  'InternalRotationSideStretchLeft',
  'InternalRotationSideStretchRight',
  'KneelingQuadStretchLeft',
  'KneelingQuadStretchRight',
  'LatStretchLeft',
  'LatStretchRight',
  'LumbarRotationsSeatedLeft',
  'LumbarRotationsSeatedRight',
  'PlankHighStatic',
  'PlankLowStatic',
  'PrayerStretch',
  'RhomboidStretch',
  'PlankSideHighStatic',
  'PlankSideHighStaticLeft',
  'PlankSideHighStaticRight',
  'PlankSideLowStatic',
  'PlankSideLowStaticLeft',
  'PlankSideLowStaticRight',
  'SquatRegularOverheadStatic',
  'SquatRegularStatic',
  'SquatSumoStatic',
  'SeatedBowArrowThoracicMobilityLeft',
  'SeatedBowArrowThoracicMobilityRight',
  'SeatedHipRotationsLeft',
  'SeatedHipRotationsRight',
  'SeatedThoracicSideBendingLeft',
  'SeatedThoracicSideBendingRight',
  'SideLungeHoldLeft',
  'SideLungeHoldRight',
  'SingleLegHamstringStretchLeft',
  'SingleLegHamstringStretchRight',
  'SingleLegStanceLeft',
  'SingleLegStanceRight',
  'SitupRussianTwistStatic',
  'StandingForwardFold',
  'WideInnerThighStretch',
  'TuckHold',
  'GlutesBridgeHold',
  'HollowHold',
  'ReverseTableTopHold',
];

const gaugeHints = [
  'CalfRaises',
  'Crunches',
  'GlutesBridge',
  'Lateral',
  'Lunge',
  'Mobility',
  'Rotation',
  'SideBend',
  'Static',
  'Stretch',
  'Jefferson',
  'Hamstring',
  'Hip',
  'InnerThigh',
  'Overhead',
  'KneeRaise',
];

const inferType = (detector: string): ExerciseType => {
  if (detector.includes('Mobility') || detector.includes('Stretch')) {
    return 'mobility';
  }
  if (
    detector.includes('Jefferson') ||
    detector.includes('HamstringMobility') ||
    detector.includes('StandingKneeRaise') ||
    detector.includes('StandingSideBend') ||
    detector.includes('LungeSideStatic')
  ) {
    return 'bodyAssessment';
  }
  if (detector.includes('Static') || detector.endsWith('Hold')) {
    return 'static';
  }
  return 'dynamic';
};

const inferUiElements = (detector: string, type: ExerciseType) => {
  const elements = [SMWorkoutLibrary.UIElement.Timer];
  if (type === 'dynamic') {
    elements.push(SMWorkoutLibrary.UIElement.RepsCounter);
  }
  if (type !== 'dynamic' || gaugeHints.some(hint => detector.includes(hint))) {
    elements.push(SMWorkoutLibrary.UIElement.GaugeOfMotion);
  }
  return Array.from(new Set(elements));
};

export const displayNameForDetector = (detector: string) =>
  detector
    .replace(/QL/g, 'Q L')
    .replace(/IT/g, 'I T')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');

export const EXERCISE_CATALOG = FALLBACK_DETECTORS.reduce<
  Record<string, ExerciseCatalogEntry>
>((catalog, detector) => {
  const type = inferType(detector);
  catalog[detector] = {
    detector,
    type,
    uiElements: inferUiElements(detector, type),
    defaultDuration: type === 'dynamic' ? 20 : 10,
    videoInstruction: `${detector}InstructionVideo`,
  };
  return catalog;
}, {});

export const fallbackDetectors = Object.keys(EXERCISE_CATALOG).sort((a, b) =>
  displayNameForDetector(a).localeCompare(displayNameForDetector(b)),
);
