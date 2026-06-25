import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  configure,
  startAssessment,
  startCustomAssessment,
  startCustomWorkout,
  startWorkoutProgram,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';
import UISettingsScreen from './components/UISettingsScreen';
import WorkoutBuilderScreen from './components/WorkoutBuilderScreen';
import {
  applyDemoSettings,
  buildModifications,
  createDefaultDemoSettings,
  DemoSettings,
} from './components/demoSettings';

const ASSESSMENT_TYPES = [
  { label: 'Fitness', value: SMWorkoutLibrary.AssessmentTypes.Fitness },
  { label: 'Body360', value: SMWorkoutLibrary.AssessmentTypes.Body360 },
  { label: 'Cardio', value: SMWorkoutLibrary.AssessmentTypes.Cardio },
  { label: 'Strength', value: SMWorkoutLibrary.AssessmentTypes.Strength },
  { label: 'Custom', value: SMWorkoutLibrary.AssessmentTypes.Custom },
];

const SUCCESS_SOUND =
  'https://cdn.pixabay.com/download/audio/2024/07/04/audio_5fd8f48411.mp3?filename=success-221935.mp3';
const FAILED_SOUND =
  'https://cdn.pixabay.com/download/audio/2024/12/20/audio_9ce4f6c763.mp3?filename=cartoon-fail-trumpet-278822.mp3';

const App = () => {
  const [settings, setSettings] = useState<DemoSettings>(() =>
    createDefaultDemoSettings(),
  );
  const [didConfig, setDidConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authKey, setAuthKey] = useState('');

  const [showSummary, setShowSummary] = useState(true);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState(
    SMWorkoutLibrary.AssessmentTypes.Fitness,
  );
  const [assessmentId, setAssessmentId] = useState('');

  const [showUISettings, setShowUISettings] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [showWFPUI, setWPFUI] = useState(false);

  const [week, setWeek] = useState('1');
  const [bodyZone, setBodyZone] = useState(SMWorkoutLibrary.BodyZone.FullBody);
  const [difficulty, setDifficulty] = useState(
    SMWorkoutLibrary.WorkoutDifficulty.LowDifficulty,
  );
  const [duration, setDuration] = useState(
    SMWorkoutLibrary.WorkoutDuration.Long,
  );
  const [language, setLanguage] = useState(SMWorkoutLibrary.Language.English);
  const [programName, setProgramName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState('');

  useEffect(() => {
    const didExitWorkoutSub = DeviceEventEmitter.addListener(
      'didExitWorkout',
      params => {
        showSummaryModal(summaryFromParams(params));
      },
    );
    const workoutDidFinishSub = DeviceEventEmitter.addListener(
      'workoutDidFinish',
      params => {
        showSummaryModal(summaryFromParams(params));
      },
    );
    const workoutErrorSub = DeviceEventEmitter.addListener(
      'workoutError',
      params => {
        console.log('workoutError:', summaryFromParams(params));
      },
    );
    const exerciseDidFinishSub = DeviceEventEmitter.addListener(
      'exerciseDidFinish',
      params => {
        console.log('exerciseDidFinish:', summaryFromParams(params));
      },
    );
    return () => {
      didExitWorkoutSub.remove();
      workoutDidFinishSub.remove();
      workoutErrorSub.remove();
      exerciseDidFinishSub.remove();
    };
  }, []);

  const showSummaryModal = (summary: string) => {
    setSummaryMessage(summary);
    setModalVisible(true);
  };

  if (showUISettings) {
    return (
      <UISettingsScreen
        settings={settings}
        onChange={setSettings}
        onDone={() => setShowUISettings(false)}
      />
    );
  }

  if (showWorkoutBuilder) {
    return (
      <WorkoutBuilderScreen
        settings={settings}
        onChangeSettings={setSettings}
        onBack={() => setShowWorkoutBuilder(false)}
        onResult={showSummaryModal}
      />
    );
  }

  if (showWFPUI) {
    return (
      <SafeAreaView style={s.safeArea}>
        <ScrollView contentContainerStyle={s.wfpContainer}>
          <Text style={s.wfpLabel}>Workout ID:</Text>
          <TextInput
            style={s.wfpInput}
            value={programName}
            onChangeText={setProgramName}
            placeholder="Program name"
            placeholderTextColor="#999"
          />
          <Text style={s.wfpLabel}>Week:</Text>
          <TextInput
            style={s.wfpInput}
            value={week}
            onChangeText={setWeek}
            keyboardType="numeric"
            placeholder="Week number"
            placeholderTextColor="#999"
          />
          <Text style={s.wfpLabel}>Duration:</Text>
          <SegmentRow
            value={duration}
            options={[
              ['Long', SMWorkoutLibrary.WorkoutDuration.Long],
              ['Short', SMWorkoutLibrary.WorkoutDuration.Short],
            ]}
            onChange={setDuration}
          />
          <Text style={s.wfpLabel}>Body Zone:</Text>
          <SegmentRow
            value={bodyZone}
            options={[
              ['Upper Body', SMWorkoutLibrary.BodyZone.UpperBody],
              ['Lower Body', SMWorkoutLibrary.BodyZone.LowerBody],
              ['Full Body', SMWorkoutLibrary.BodyZone.FullBody],
            ]}
            onChange={setBodyZone}
          />
          <Text style={s.wfpLabel}>Language:</Text>
          <SegmentRow
            value={language}
            options={[
              ['Hebrew', SMWorkoutLibrary.Language.Hebrew],
              ['English', SMWorkoutLibrary.Language.English],
            ]}
            onChange={setLanguage}
          />
          <Text style={s.wfpLabel}>Difficulty:</Text>
          <SegmentRow
            value={difficulty}
            options={[
              ['Low', SMWorkoutLibrary.WorkoutDifficulty.LowDifficulty],
              ['Mid', SMWorkoutLibrary.WorkoutDifficulty.MidDifficulty],
              ['High', SMWorkoutLibrary.WorkoutDifficulty.HighDifficulty],
            ]}
            onChange={setDifficulty}
          />
          <Pressable style={s.btn} onPress={startWorkoutProgramSession}>
            <Text style={s.btnText}>Start</Text>
          </Pressable>
          <Pressable
            style={[s.btn, s.secondaryBtn]}
            onPress={() => setWPFUI(false)}
          >
            <Text style={s.btnText}>Back</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView contentContainerStyle={s.mainContainer}>
        {isLoading && (
          <ActivityIndicator size="large" color="#007AFF" style={s.loader} />
        )}

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={s.modalBg}>
            <View style={s.modalCard}>
              <ScrollView style={s.modalScroll}>
                <Text style={s.modalText}>{summaryMessage}</Text>
              </ScrollView>
              <TouchableOpacity
                style={s.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={s.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {didConfig ? (
          <>
            <Text style={s.sectionLabel}>Assessment Type:</Text>
            <SegmentRow
              value={selectedAssessmentType}
              options={ASSESSMENT_TYPES.map(({ label, value }) => [
                label,
                value,
              ])}
              onChange={setSelectedAssessmentType}
            />

            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>Show Summary</Text>
              <Switch value={showSummary} onValueChange={setShowSummary} />
            </View>

            <Pressable
              style={s.uiSettingsBtn}
              onPress={() => setShowUISettings(true)}
            >
              <Text style={s.uiSettingsBtnText}>UI Settings</Text>
            </Pressable>

            <Pressable
              style={s.btn}
              onPress={() => setShowWorkoutBuilder(true)}
            >
              <Text style={s.btnText}>Build Workout</Text>
            </Pressable>

            <Pressable
              style={s.btn}
              onPress={() =>
                startAssessmentSession(
                  selectedAssessmentType,
                  showSummary,
                  assessmentId,
                )
              }
            >
              <Text style={s.btnText}>Start Sency Assessment</Text>
            </Pressable>

            <Pressable style={s.btn} onPress={startExampleCustomWorkout}>
              <Text style={s.btnText}>Example Custom Workout</Text>
            </Pressable>

            <Pressable style={s.btn} onPress={startExampleCustomAssessment}>
              <Text style={s.btnText}>Customized Assessment</Text>
            </Pressable>

            <TextInput
              style={s.textInput}
              value={assessmentId}
              onChangeText={setAssessmentId}
              placeholder="Assessment ID"
              placeholderTextColor="#999"
            />
            <Pressable
              style={s.btn}
              onPress={() =>
                startAssessmentSession(
                  SMWorkoutLibrary.AssessmentTypes.Custom,
                  showSummary,
                  assessmentId,
                )
              }
            >
              <Text style={s.btnText}>Custom Assessment</Text>
            </Pressable>

            <Pressable
              style={[s.btn, s.secondaryBtn]}
              onPress={() => setWPFUI(true)}
            >
              <Text style={s.btnText}>Workout From Program</Text>
            </Pressable>
          </>
        ) : (
          <View style={s.configureCard}>
            <Text style={s.sectionLabel}>SDK Language:</Text>
            <SegmentRow
              value={language}
              options={[
                ['English', SMWorkoutLibrary.Language.English],
                ['Hebrew', SMWorkoutLibrary.Language.Hebrew],
              ]}
              onChange={setLanguage}
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setAuthKey}
              placeholder="SMKitUI auth key"
              secureTextEntry
              style={s.textInput}
              value={authKey}
            />
            <Pressable
              disabled={isLoading || authKey.trim().length === 0}
              style={[
                s.btn,
                (isLoading || authKey.trim().length === 0) && s.disabledBtn,
              ]}
              onPress={() => configureSdk(language)}
            >
              <Text style={s.btnText}>
                {isLoading ? 'Configuring...' : 'Configure SDK'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  async function configureSdk(selectedLanguage: SMWorkoutLibrary.Language) {
    setIsLoading(true);
    try {
      const apiKey = authKey.trim();
      const nextSettings = {
        ...settings,
        sessionLanguage: selectedLanguage,
        phoneCalibrationLanguage: selectedLanguage,
      };
      setLanguage(selectedLanguage);
      setSettings(nextSettings);
      await configure(apiKey, selectedLanguage);
      await applyDemoSettings(nextSettings);
      setDidConfig(true);
    } catch (error) {
      Alert.alert('Configure Failed', String(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function startAssessmentSession(
    type: SMWorkoutLibrary.AssessmentTypes,
    showSum: boolean,
    customId: string,
  ) {
    try {
      await applyDemoSettings(settings);
      const result = await startAssessment(
        type,
        showSum,
        null,
        false,
        customId || '',
        buildModifications(settings),
      );
      showSummaryModal(result.summary || JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Unable to start assessment', String(error));
    }
  }

  async function startExampleCustomWorkout() {
    try {
      await applyDemoSettings(settings);
      const exercises = [
        new SMWorkoutLibrary.SMExercise(
          'Squat Regular',
          30,
          'SquatRegularInstructionVideo',
          null,
          [
            SMWorkoutLibrary.UIElement.RepsCounter,
            SMWorkoutLibrary.UIElement.Timer,
            SMWorkoutLibrary.UIElement.GaugeOfMotion,
          ],
          'SquatRegular',
          null,
          null,
          {
            shortIntro: true,
            playPreExerciseCountdown: true,
            playRepMilestoneVoice: true,
            repMilestoneInterval: 5,
            playSoundOnEachRep: true,
            adaptiveRomFeedbackEnabled: true,
            adaptiveRomWarmupReps: 2,
          },
        ),
        new SMWorkoutLibrary.SMExercise(
          'Jefferson Curl',
          20,
          'JeffersonCurlInstructionVideo',
          null,
          [
            SMWorkoutLibrary.UIElement.GaugeOfMotion,
            SMWorkoutLibrary.UIElement.Timer,
          ],
          'JeffersonCurl',
          null,
          null,
          {
            guidanceMode: true,
            phonePosition: SMWorkoutLibrary.PhonePosition.Floor,
            stretchSetConfig: new SMWorkoutLibrary.StretchSetConfig(3, 8, {
              restSecondsBetweenStretches: 4,
            }),
          },
        ),
      ];
      const workout = new SMWorkoutLibrary.SMWorkout(
        'example-workout',
        'Example Custom Workout',
        null,
        null,
        exercises,
        null,
        null,
        null,
      );
      const result = await startCustomWorkout(
        workout,
        buildModifications(settings),
      );
      showSummaryModal(result.summary || JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Custom workout error', String(error));
    }
  }

  async function startExampleCustomAssessment() {
    try {
      await applyDemoSettings(settings);
      const exercises = [
        new SMWorkoutLibrary.SMAssessmentExercise(
          'SquatRegular',
          35,
          'SquatRegularInstructionVideo',
          null,
          [
            SMWorkoutLibrary.UIElement.RepsCounter,
            SMWorkoutLibrary.UIElement.Timer,
          ],
          'SquatRegular',
          SUCCESS_SOUND,
          new SMWorkoutLibrary.SMScoringParams(
            SMWorkoutLibrary.ScoringType.Reps,
            0.3,
            null,
            5,
            null,
            null,
          ),
          FAILED_SOUND,
          'SquatRegular',
          'Subtitle',
          'Reps',
          'clean reps',
          { shortIntro: true, playPreExerciseCountdown: true },
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'LungeFront',
          35,
          'LungeFrontInstructionVideo',
          null,
          [
            SMWorkoutLibrary.UIElement.RepsCounter,
            SMWorkoutLibrary.UIElement.Timer,
          ],
          'LungeFront',
          SUCCESS_SOUND,
          new SMWorkoutLibrary.SMScoringParams(
            SMWorkoutLibrary.ScoringType.Reps,
            0.3,
            null,
            5,
            null,
            null,
          ),
          FAILED_SOUND,
          'LungeFront',
          'Subtitle',
          'Reps',
          'clean reps',
          { playRepMilestoneVoice: true, repMilestoneInterval: 5 },
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'PlankHighStatic',
          35,
          'PlankHighStaticInstructionVideo',
          null,
          [SMWorkoutLibrary.UIElement.Timer],
          'PlankHighStatic',
          SUCCESS_SOUND,
          new SMWorkoutLibrary.SMScoringParams(
            SMWorkoutLibrary.ScoringType.Time,
            0.3,
            15,
            null,
            null,
            null,
          ),
          FAILED_SOUND,
          'PlankHighStatic',
          'Subtitle',
          'Time',
          'seconds held',
          {
            guidanceMode: true,
            ...(Platform.OS === 'ios' ? { useWideAngleCamera: false } : {}),
          },
        ),
      ];

      const assessment = new SMWorkoutLibrary.SMWorkout(
        'example-assessment',
        'Example Custom Assessment',
        null,
        null,
        exercises,
        null,
        null,
        null,
      );
      const result = await startCustomAssessment(
        assessment,
        null,
        true,
        showSummary,
        buildModifications(settings),
      );
      showSummaryModal(result.summary || JSON.stringify(result, null, 2));
    } catch (error) {
      Alert.alert('Custom assessment error', String(error));
    }
  }

  async function startWorkoutProgramSession() {
    try {
      const parsedWeek = parseInt(week, 10);
      if (Number.isNaN(parsedWeek)) {
        throw new Error('Invalid week');
      }
      const nextSettings = {
        ...settings,
        sessionLanguage: language,
        phoneCalibrationLanguage: language,
      };
      setSettings(nextSettings);
      await applyDemoSettings(nextSettings);
      const config = new SMWorkoutLibrary.WorkoutConfig(
        parsedWeek,
        bodyZone,
        difficulty,
        duration,
        language,
        programName,
        {
          phonePosition: SMWorkoutLibrary.PhonePosition.Floor,
          shortIntro: false,
        },
      );
      const result = await startWorkoutProgram(
        config,
        buildModifications(nextSettings),
      );
      const summary = result.summary || JSON.stringify(result, null, 2);
      logWorkoutProgramSummary(summary);
      showSummaryModal(summary);
    } catch (error) {
      Alert.alert('Unable to start workout program', String(error));
    }
  }
};

const SegmentRow = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [string, T][];
  onChange: (value: T) => void;
}) => (
  <View style={s.segmentRow}>
    {options.map(([label, option]) => {
      const selected = value === option;
      return (
        <Pressable
          key={label}
          style={[s.segmentBtn, selected && s.segmentBtnActive]}
          onPress={() => onChange(option)}
        >
          <Text style={[s.segmentBtnText, selected && s.segmentBtnTextActive]}>
            {label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const summaryFromParams = (params: unknown) => {
  if (params && typeof params === 'object') {
    const payload = params as Record<string, unknown>;
    if (typeof payload.summary === 'string') {
      return payload.summary;
    }
    if (typeof payload.data === 'string') {
      return payload.data;
    }
    if (typeof payload.error === 'string') {
      return payload.error;
    }
    return JSON.stringify(payload, null, 2);
  }
  return String(params ?? '');
};

const logWorkoutProgramSummary = (summary: string) => {
  console.log('[WORKOUT_PROGRAM_SUMMARY_DEBUG] raw summary:', summary);

  try {
    const parsed = JSON.parse(summary) as Record<string, unknown>;
    const exercises = parsed.exercises;
    console.log('[WORKOUT_PROGRAM_SUMMARY_DEBUG] totals:', {
      total_score: parsed.total_score,
      total_score_segmented: parsed.total_score_segmented,
      total_time: parsed.total_time,
      end_time: parsed.end_time,
      exercises: Array.isArray(exercises) ? exercises.length : undefined,
    });
  } catch (error) {
    console.log('[WORKOUT_PROGRAM_SUMMARY_DEBUG] parse error:', error);
  }
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  mainContainer: { alignItems: 'stretch', padding: 20 },
  wfpContainer: { padding: 20 },
  loader: { marginBottom: 12 },
  sectionLabel: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  segmentBtn: {
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    flex: 1,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentBtnActive: { backgroundColor: '#007AFF' },
  segmentBtnText: { color: '#333', fontSize: 13, fontWeight: '600' },
  segmentBtnTextActive: { color: '#fff' },
  toggleRow: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleLabel: { color: '#000', fontSize: 15 },
  uiSettingsBtn: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    paddingVertical: 10,
  },
  uiSettingsBtnText: { color: '#007AFF', fontSize: 15, fontWeight: '700' },
  btn: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingVertical: 12,
  },
  secondaryBtn: { backgroundColor: '#555' },
  disabledBtn: { opacity: 0.55 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  configureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#C7C7CC',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    color: '#000',
    fontSize: 15,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  wfpLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  wfpInput: {
    backgroundColor: '#fff',
    borderColor: '#C7C7CC',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalBg: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    maxHeight: '80%',
    padding: 20,
    width: '85%',
  },
  modalScroll: { maxHeight: 400 },
  modalText: { color: '#007AFF', fontSize: 14, marginBottom: 8 },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
  },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pendingText: { color: '#999', textAlign: 'center' },
});

export default App;
