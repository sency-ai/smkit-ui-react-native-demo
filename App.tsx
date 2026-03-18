import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  DeviceEventEmitter,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  configure,
  startAssessment,
  startCustomAssessment,
  setSessionLanguage,
  setPhoneCalibrationLanguage,
  startCustomWorkout,
  startWorkoutProgram,
  setEndExercisePreferences,
  setCounterPreferences,
  setInstructionVideoConfig,
  setIntelligenceRestEnabled,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';
import UISettingsScreen, { UISettingsResult } from './components/UISettingsScreen';

const ASSESSMENT_TYPES = [
  { label: 'Fitness', value: SMWorkoutLibrary.AssessmentTypes.Fitness },
  { label: 'Body360', value: SMWorkoutLibrary.AssessmentTypes.Body360 },
  { label: 'Cardio', value: SMWorkoutLibrary.AssessmentTypes.Cardio },
  { label: 'Strength', value: SMWorkoutLibrary.AssessmentTypes.Strength },
  { label: 'Custom', value: SMWorkoutLibrary.AssessmentTypes.Custom },
];

const App = () => {
  const [didConfig, setDidConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showSummary, setShowSummary] = useState(true);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState(SMWorkoutLibrary.AssessmentTypes.Fitness);
  const [assessmentId, setAssessmentId] = useState('');
  const [uiSettingsResult, setUiSettingsResult] = useState<UISettingsResult | null>(null);

  // Navigation state
  const [showUISettings, setShowUISettings] = useState(false);
  const [showWFPUI, setWPFUI] = useState(false);

  // WFP state
  const [week, setWeek] = useState('1');
  const [bodyZone, setBodyZone] = useState(SMWorkoutLibrary.BodyZone.FullBody);
  const [difficulty, setDifficulty] = useState(SMWorkoutLibrary.WorkoutDifficulty.LowDifficulty);
  const [duration, setDuration] = useState(SMWorkoutLibrary.WorkoutDuration.Long);
  const [language, setLanguage] = useState(SMWorkoutLibrary.Language.Hebrew);
  const [programName, setProgramName] = useState('');

  // Summary modal
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryMessage, setSummaryMessage] = useState('');

  const getModifications = () => JSON.stringify({
    primaryColor: 'green',
    phoneCalibration: {
      enabled: true,
      autoCalibrate: false,
      calibrationSensitivity: 0.8,
    },
    showProgressBar: true,
    showCounters: true,
  });

  useEffect(() => {
    configureSMKitUI();
  }, []);

  useEffect(() => {
    const didExitWorkoutSub = DeviceEventEmitter.addListener('didExitWorkout', (params) => {
      setSummaryMessage(params.summary);
      setModalVisible(true);
    });
    const workoutDidFinishSub = DeviceEventEmitter.addListener('workoutDidFinish', (params) => {
      setSummaryMessage(params.summary);
      setModalVisible(true);
    });
    const workoutErrorSub = DeviceEventEmitter.addListener('workoutError', (params) => {
      console.log('workoutError:', params.error);
    });
    const exerciseDidFinishSub = DeviceEventEmitter.addListener('exerciseDidFinish', (params) => {
      console.log('exerciseDidFinish:', params.data);
    });
    return () => {
      didExitWorkoutSub.remove();
      workoutDidFinishSub.remove();
      workoutErrorSub.remove();
      exerciseDidFinishSub.remove();
    };
  }, []);

  async function configureSMKitUI() {
    setIsLoading(true);
    try {
      const apiKey = '';
      await configure(apiKey);

      await setInstructionVideoConfig({
        displayMode: 'mediumCycle',
        mediumSizeCycles: 2,
      });

      await setIntelligenceRestEnabled(true);
      await setSessionLanguage(SMWorkoutLibrary.Language.Hebrew);
      await setPhoneCalibrationLanguage(SMWorkoutLibrary.Language.Hebrew);

      setIsLoading(false);
      setDidConfig(true);
    } catch (e) {
      setIsLoading(false);
      Alert.alert('Configure Failed', String(e));
    }
  }

  // ── navigation ───────────────────────────────────────────
  if (showUISettings) {
    return (
      <UISettingsScreen
        initialConfig={uiSettingsResult?.skeletonConfig}
        initialEnableIntelligenceRest={uiSettingsResult?.enableIntelligenceRest ?? true}
        onDone={(result) => {
          setUiSettingsResult(result);
          setShowUISettings(false);
        }}
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
          />
          <Text style={s.wfpLabel}>Week:</Text>
          <TextInput
            style={s.wfpInput}
            value={week}
            onChangeText={setWeek}
            keyboardType="numeric"
            placeholder="Week number"
          />
          <Text style={s.wfpLabel}>Duration:</Text>
          <View style={s.segmentRow}>
            {['Long', 'Short'].map((label, i) => (
              <Pressable
                key={label}
                style={[s.segmentBtn, duration === (i === 0 ? SMWorkoutLibrary.WorkoutDuration.Long : SMWorkoutLibrary.WorkoutDuration.Short) && s.segmentBtnActive]}
                onPress={() => setDuration(i === 0 ? SMWorkoutLibrary.WorkoutDuration.Long : SMWorkoutLibrary.WorkoutDuration.Short)}
              >
                <Text style={[s.segmentBtnText, duration === (i === 0 ? SMWorkoutLibrary.WorkoutDuration.Long : SMWorkoutLibrary.WorkoutDuration.Short) && s.segmentBtnTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.wfpLabel}>Body Zone:</Text>
          <View style={s.segmentRow}>
            {[['Upper Body', SMWorkoutLibrary.BodyZone.UpperBody], ['Lower Body', SMWorkoutLibrary.BodyZone.LowerBody], ['Full Body', SMWorkoutLibrary.BodyZone.FullBody]].map(([label, val]) => (
              <Pressable
                key={label as string}
                style={[s.segmentBtn, bodyZone === val && s.segmentBtnActive]}
                onPress={() => setBodyZone(val as SMWorkoutLibrary.BodyZone)}
              >
                <Text style={[s.segmentBtnText, bodyZone === val && s.segmentBtnTextActive]}>{label as string}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.wfpLabel}>Language:</Text>
          <View style={s.segmentRow}>
            {[['Hebrew', SMWorkoutLibrary.Language.Hebrew], ['English', SMWorkoutLibrary.Language.English]].map(([label, val]) => (
              <Pressable
                key={label as string}
                style={[s.segmentBtn, language === val && s.segmentBtnActive]}
                onPress={() => setLanguage(val as SMWorkoutLibrary.Language)}
              >
                <Text style={[s.segmentBtnText, language === val && s.segmentBtnTextActive]}>{label as string}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.wfpLabel}>Difficulty:</Text>
          <View style={s.segmentRow}>
            {[['Low', SMWorkoutLibrary.WorkoutDifficulty.LowDifficulty], ['Mid', SMWorkoutLibrary.WorkoutDifficulty.MidDifficulty], ['High', SMWorkoutLibrary.WorkoutDifficulty.HighDifficulty]].map(([label, val]) => (
              <Pressable
                key={label as string}
                style={[s.segmentBtn, difficulty === val && s.segmentBtnActive]}
                onPress={() => setDifficulty(val as SMWorkoutLibrary.WorkoutDifficulty)}
              >
                <Text style={[s.segmentBtnText, difficulty === val && s.segmentBtnTextActive]}>{label as string}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={s.btn} onPress={startWorkoutProgramSession}>
            <Text style={s.btnText}>Start</Text>
          </Pressable>
          <Pressable style={[s.btn, { backgroundColor: '#888' }]} onPress={() => setWPFUI(false)}>
            <Text style={s.btnText}>Back</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── main screen ──────────────────────────────────────────
  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView contentContainerStyle={s.mainContainer}>
        {isLoading && <ActivityIndicator size="large" color="#007AFF" style={{ marginBottom: 12 }} />}

        {/* Summary result modal */}
        <Modal
          transparent visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={s.modalBg}>
            <View style={s.modalCard}>
              <ScrollView style={s.modalScroll}>
                <Text style={s.modalText}>{summaryMessage}</Text>
              </ScrollView>
              <TouchableOpacity style={s.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={s.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {didConfig && (
          <>
            {/* Assessment type picker */}
            <Text style={s.sectionLabel}>Assessment Type:</Text>
            <View style={s.segmentRow}>
              {ASSESSMENT_TYPES.map(({ label, value }) => (
                <Pressable
                  key={label}
                  style={[s.segmentBtn, selectedAssessmentType === value && s.segmentBtnActive]}
                  onPress={() => setSelectedAssessmentType(value)}
                >
                  <Text style={[s.segmentBtnText, selectedAssessmentType === value && s.segmentBtnTextActive]}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Show summary toggle */}
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>Show Summary</Text>
              <Switch value={showSummary} onValueChange={setShowSummary} />
            </View>

            {/* UI Settings button */}
            <Pressable style={s.uiSettingsBtn} onPress={() => setShowUISettings(true)}>
              <Text style={s.uiSettingsBtnText}>
                {uiSettingsResult ? '⚙️ UI Settings ✓' : '⚙️ UI Settings'}
              </Text>
            </Pressable>

            <View style={{ height: 16 }} />

            {/* Main action buttons */}
            <Pressable style={s.btn} onPress={() => startAssessmentSession(selectedAssessmentType, showSummary, assessmentId)}>
              <Text style={s.btnText}>Start Sency Assessment</Text>
            </Pressable>

            <Pressable style={s.btn} onPress={startSMKitUICustomWorkout}>
              <Text style={s.btnText}>Customized Workout</Text>
            </Pressable>

            <Pressable style={s.btn} onPress={startSMKitUICustomAssessment}>
              <Text style={s.btnText}>Customized Assessment</Text>
            </Pressable>

            {/* Assessment ID field + button */}
            <TextInput
              style={s.textInput}
              value={assessmentId}
              onChangeText={setAssessmentId}
              placeholder="Assessment ID"
              placeholderTextColor="#999"
            />
            <Pressable style={s.btn} onPress={() => startAssessmentSession(SMWorkoutLibrary.AssessmentTypes.Custom, showSummary, assessmentId)}>
              <Text style={s.btnText}>Custom Assessment</Text>
            </Pressable>

            <Pressable style={[s.btn, { backgroundColor: '#555' }]} onPress={() => setWPFUI(true)}>
              <Text style={s.btnText}>Workout From Program</Text>
            </Pressable>
          </>
        )}

        {!didConfig && !isLoading && (
          <Text style={{ color: '#999', textAlign: 'center' }}>Configuring…</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  // ── actions ──────────────────────────────────────────────
  async function startAssessmentSession(
    type: SMWorkoutLibrary.AssessmentTypes,
    showSum: boolean,
    customId: string,
  ) {
    try {
      const result = await startAssessment(type, showSum, null, false, customId || '', getModifications());
      console.log('Assessment result:', result.didFinish);
    } catch (e) {
      Alert.alert('Unable to start assessment', String(e));
    }
  }

  async function startSMKitUICustomWorkout() {
    try {
      const exercises = [
        new SMWorkoutLibrary.SMAssessmentExercise(
          'SquatRegularOverheadStatic', 30, 'SquatRegularOverheadStatic', null,
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer],
          'SquatRegularOverheadStatic', null,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Time, 0.5, 20, null, null, null),
          '', 'SquatRegularOverheadStatic', 'Subtitle', 'timeInPosition', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'Jefferson Curl', 30, 'JeffersonCurl', null,
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer],
          'JeffersonCurl', null,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Time, 0.5, 20, null, null, null),
          '', 'JeffersonCurl', 'Subtitle', 'timeInPosition', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'Push-Up', 30, 'PushupRegular', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'PushupRegular', null,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.5, null, 6, null, null),
          '', 'PushupRegular', 'Subtitle', 'Reps', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'LungeFrontRight', 30, 'LungeFrontRight', null,
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer],
          'LungeFront', null,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.5, null, 20, null, null),
          '', 'LungeFrontRight', 'Subtitle', 'timeInPosition', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'LungeFrontLeft', 30, 'LungeFrontLeft', null,
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer],
          'LungeFront', null,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.5, null, 20, null, null),
          '', 'LungeFrontLeft', 'Subtitle', 'timeInPosition', 'clean reps',
        ),
      ];
      const workout = new SMWorkoutLibrary.SMWorkout('50', 'demo workout', null, null, exercises, null, null, null);
      const result = await startCustomWorkout(workout, getModifications());
      console.log('Custom workout result:', result.didFinish);
    } catch (e) {
      Alert.alert('Custom workout error', String(e));
    }
  }

  async function startSMKitUICustomAssessment() {
    try {
      const successSound =
        'https://cdn.pixabay.com/download/audio/2024/07/04/audio_5fd8f48411.mp3?filename=success-221935.mp3';
      const failedSound =
        'https://cdn.pixabay.com/download/audio/2024/12/20/audio_9ce4f6c763.mp3?filename=cartoon-fail-trumpet-278822.mp3';

      const exercises = [
        new SMWorkoutLibrary.SMAssessmentExercise(
          'SquatRegular', 35, 'SquatRegular', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'SquatRegular', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.3, null, 5, null, null),
          failedSound, 'SquatRegular', 'Subtitle', 'Reps', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'LungeFront', 35, 'LungeFront', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'LungeFront', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.3, null, 5, null, null),
          failedSound, 'LungeFront', 'Subtitle', 'Reps', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'HighKnees', 35, 'HighKnees', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'HighKnees', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Reps, 0.3, null, 5, null, null),
          failedSound, 'HighKnees', 'Subtitle', 'Reps', 'clean reps',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'SquatRegularOverheadStatic', 35, 'SquatRegularOverheadStatic', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'SquatRegularOverheadStatic', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Time, 0.3, 15, null, null, null),
          failedSound, 'SquatRegularOverheadStatic', 'Subtitle', 'Time', 'seconds held',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'PlankHighStatic', 35, 'PlankHighStatic', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'PlankHighStatic', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Time, 0.3, 15, null, null, null),
          failedSound, 'PlankHighStatic', 'Subtitle', 'Time', 'seconds held',
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'StandingSideBendRight', 35, 'StandingSideBendRight', null,
          [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer],
          'StandingSideBendRight', successSound,
          new SMWorkoutLibrary.SMScoringParams(SMWorkoutLibrary.ScoringType.Time, 0.3, 15, null, null, null),
          failedSound, 'PlankHighStatic', 'Subtitle', 'Time', 'seconds held',
        ),
      ];

      const assessment = new SMWorkoutLibrary.SMWorkout('50', 'demo workout', null, null, exercises, null, null, null);

      setEndExercisePreferences(SMWorkoutLibrary.EndExercisePreferences.TargetBased);
      setCounterPreferences(SMWorkoutLibrary.CounterPreferences.PerfectOnly);
      await setSessionLanguage(language);
      await setPhoneCalibrationLanguage(language);

      const result = await startCustomAssessment(assessment, null, true, showSummary, getModifications());
      console.log('Custom assessment result:', result.didFinish);
    } catch (e) {
      Alert.alert('Custom assessment error', String(e));
    }
  }

  async function startWorkoutProgramSession() {
    try {
      const parsedWeek = parseInt(week, 10);
      if (isNaN(parsedWeek)) throw new Error('Invalid week');
      await setSessionLanguage(language);
      await setPhoneCalibrationLanguage(language);
      const config = new SMWorkoutLibrary.WorkoutConfig(parsedWeek, bodyZone, difficulty, duration, language, programName);
      const result = await startWorkoutProgram(config, getModifications());
      console.log('WFP result:', result.didFinish);
    } catch (e) {
      Alert.alert('Unable to start workout program', String(e));
    }
  }
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  mainContainer: { padding: 20, alignItems: 'stretch' },
  wfpContainer: { padding: 20 },

  sectionLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 8 },

  segmentRow: { flexDirection: 'row', marginBottom: 12, gap: 8, flexWrap: 'wrap' },
  segmentBtn: {
    flex: 1, minWidth: 60, paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 8, backgroundColor: '#E5E5EA', alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#007AFF' },
  segmentBtnText: { fontSize: 13, color: '#333', fontWeight: '500' },
  segmentBtnTextActive: { color: '#fff' },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 8,
  },
  toggleLabel: { fontSize: 15, color: '#000' },

  uiSettingsBtn: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#007AFF',
    paddingVertical: 10, alignItems: 'center',
  },
  uiSettingsBtnText: { color: '#007AFF', fontSize: 15, fontWeight: '600' },

  btn: {
    backgroundColor: '#007AFF', borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginBottom: 8,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  textInput: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 15, color: '#000', marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth, borderColor: '#C7C7CC',
  },

  wfpLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 8 },
  wfpInput: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 14, color: '#000', borderWidth: StyleSheet.hairlineWidth, borderColor: '#C7C7CC',
    marginBottom: 4,
  },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', maxHeight: '80%', backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalScroll: { maxHeight: 400 },
  modalText: { fontSize: 14, color: '#007AFF', marginBottom: 8 },
  closeBtn: { backgroundColor: '#FF3B30', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default App;
