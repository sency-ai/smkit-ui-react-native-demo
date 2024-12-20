import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  configure,
  startAssessment,
  startCustomWorkout,
  startWorkoutProgram,
  startCustomAssessment,
} from '@sency/react-native-smkit-ui/src/index';
import * as SMWorkoutLibrary from '@sency/react-native-smkit-ui/src/SMWorkout';

const App = () => {
  const [didConfig, setDidConfig] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    configureSMKitUI();
  }, []);

  return (
    <View style={styles.centeredView}>
      {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
        <View>
        <Pressable
          disabled={!didConfig}
          style={[styles.button]}
          onPress={() => startAssessmentSession(SMWorkoutLibrary.AssessmentTypes.Fitness, true, "")}>
          <Text style={styles.textStyle}>Start Assessment</Text>
        </Pressable>

        <Pressable
          disabled={!didConfig}
          style={[styles.button]}
          onPress={() => startAssessmentSession(SMWorkoutLibrary.AssessmentTypes.Custom, true, "YOUR_CUSTOM_ASSESSMENT")}>
          <Text style={styles.textStyle}>Start Custom Assessment</Text>
        </Pressable>

        <Pressable
          disabled={!didConfig}
          style={[styles.button]}
          onPress={() => startAssessmentSession(SMWorkoutLibrary.AssessmentTypes.Body360, true, "")}>
          <Text style={styles.textStyle}>Start Body360 Assessment</Text>
        </Pressable>

        <Pressable
          disabled={!didConfig}
          style={[styles.button]}
          onPress={() => startSMKitUICustomWorkout()}>
          <Text style={styles.textStyle}>Start startCustomWorkout</Text>
        </Pressable>

        <Pressable
          disabled={!didConfig}
          style={[styles.button]}
          onPress={() => startSMKitUICustomAssessment()}>
          <Text style={styles.textStyle}>Start customized assessment</Text>
        </Pressable>

        </View>
    </View>
  );

  async function configureSMKitUI() {
    setisLoading(true);
    try {
      var res = await configure('YOUR_AUTH_KEY');
      setisLoading(false);
      setDidConfig(true);
    } catch (e) {
      setisLoading(false);
      Alert.alert('Configure Failed'),
        '',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}];
    }
  }

  async function startAssessmentSession(
    type: SMWorkoutLibrary.AssessmentTypes, // => The type of assessment, which can be either AssessmentTypes.Fitness or AssessmentTypes.Custom.
    showSummary: boolean, // => Determines whether the summary screen will be presented at the end of the exercise.
    customAssessmentID: string, // If you have more than one custom assessment, use the customAssessmentID to specify which one to call, if not please use null.
  ) {
    try {
      var userData = new SMWorkoutLibrary.UserData(SMWorkoutLibrary.Gender.Female, 27)
      var result = await startAssessment(type, showSummary, userData, false, customAssessmentID);
      console.log(result.summary);
      console.log(result.didFinish);
    }catch(e) {
      Alert.alert('Unable to start assessment'),
        '',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}];
    }
  }

  async function startSMKitUICustomWorkout() {
    try{
      // list of exercies
      var exercises = [
        new SMWorkoutLibrary.SMExercise(
          "Plank", // => name:string | null
          60, // => totalSeconds: number | null
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // => videoInstruction: string | null (url for a video)
          "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3", // => exerciseIntro: string | null (url for a sound)
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer], // => uiElements: UIElement[] | null
          "PlankHighStatic", // => detector: string
          "", // => exerciseClosure: string | null (url for a sound)
          null
        ),
        new SMWorkoutLibrary.SMExercise(
          "Second Exercise", // => name:string | null
          25, // => totalSeconds: number | null
          null, // => videoInstruction: string | null (url for a video)
          null, // => exerciseIntro: string | null (url for a sound)
          [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer], // => uiElements: UIElement[] | null
          "SquatRegularOverheadStatic", // => detector: string
          null, // => exerciseClosure: string | null (url for a sound)
          null
        ),
      ];
  
      var workout = new SMWorkoutLibrary.SMWorkout(
        "50", // => id: string | null
        "demo workout",// => name: string | null
        null, // => workoutIntro: string | null (url for a sound)
        null, // => soundtrack: string | null (url for a sound)
        exercises, // => exercises: SMExercise[]
        null, // =>  getInFrame: string | null (url for a sound)
        null, // =>  bodycalFinished: string | null (url for a sound)
        null // =>  workoutClosure: string | null (url for a sound)
        );
      var result = await startCustomWorkout(workout);
      console.log(result.summary);
      console.log(result.didFinish);
    }catch(e){
      console.error(e);
      showAlert("Custom workout error", e + "");
    }
  }

  async function startSMKitUIProgram(){
    try{
      //WorkoutConfig
      var config = new SMWorkoutLibrary.WorkoutConfig(
        3, // => week: number
        SMWorkoutLibrary.BodyZone.FullBody, // => bodyZone: BodyZone
        SMWorkoutLibrary.WorkoutDifficulty.HighDifficulty, // => difficultyLevel: WorkoutDifficulty
        SMWorkoutLibrary.WorkoutDuration.Short, // =>   workoutDuration: WorkoutDuration
        "YOUR_PROGRAM_ID" // =>   programID: string
      );
      var result = await startWorkoutProgram(config);
      console.log(result.summary);
      console.log(result.didFinish);
    }catch(e){
      console.error(e);
    }
  }

  function showAlert(title: string, massege: string){
    Alert.alert(title, massege, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  }

  async function startSMKitUICustomAssessment() {
    try{
      // list of exercies
      var exercises = [
        new SMWorkoutLibrary.SMAssessmentExercise(
          'First Exercise', // => name:string | null
          35, // => totalSeconds: number | null
          null, // => videoInstruction: string | null (url for a video)
          null, // => exerciseIntro: string | null (url for a sound)
          [
            SMWorkoutLibrary.UIElement.RepsCounter,
            SMWorkoutLibrary.UIElement.Timer,
          ], // => uiElements: UIElement[] | null
          'HighKnees', // => detector: string
          null, // => exerciseClosure: string | null (url for a sound)
          new SMWorkoutLibrary.SMScoringParams(
            SMWorkoutLibrary.ScoringType.Reps,
            0.3, // => scoreFactor: number | null
            null, // => targetTime: number | null
            20, // => targetReps: number | null
            null,
            null
          ),
          'HighKnees', // => summaryTitle: string | null
          'Subtitle', // => summarySubTitle: string | null
          'Reps', // => summaryMainMetricTitle: string | null
          'clean reps', // => summaryMainMetricSubTitle: string | null
        ),
        new SMWorkoutLibrary.SMAssessmentExercise(
          'Second Exercise', // => name:string | null
          25, // => totalSeconds: number | null
          'SquatRegularOverheadStatic', // => videoInstruction: string | null (url for a video)
          null, // => exerciseIntro: string | null (url for a sound)
          [
            SMWorkoutLibrary.UIElement.GaugeOfMotion,
            SMWorkoutLibrary.UIElement.Timer,
          ], // => uiElements: UIElement[] | null
          'SquatRegularOverheadStatic', // => detector: string
          null, // => exerciseClosure: string | null (url for a sound)
          new SMWorkoutLibrary.SMScoringParams(
            SMWorkoutLibrary.ScoringType.Time,
            0.5, // => scoreFactor: number | null
            10, // => targetTime: number | null
            null, // => targetReps: number | null
            null,
            null
          ),
          "SquatRegularOverheadStatic", // => summaryTitle: string | null,
          "Subtitle", // => summarySubTitle: string | null,
          "timeInPosition",
        ),
      ];

      var assessment = new SMWorkoutLibrary.SMWorkout(
        "50", // => id: string | null
        "demo workout",// => name: string | null
        null, // => workoutIntro: string | null (url for a sound)
        null, // => soundtrack: string | null (url for a sound)
        exercises, // => exercises: SMExercise[]
        null, // =>  getInFrame: string | null (url for a sound)
        null, // =>  bodycalFinished: string | null (url for a sound)
        null // =>  workoutClosure: string | null (url for a sound)
      );

      /**
       * Initiates a custom assessment session.
       *
       * @param {SMWorkoutLibrary.SMWorkout} assessment - The assessment configuration for the session.
       * @param {SMWorkoutLibrary.UserData | null} userData - User data for the assessment, or `null` if no user data is provided.
       * @param {boolean} [forceShowUserDataScreen=false] - Forces the display of the user data screen even if user data is provided.
       * @param {boolean} [showSummary=true] - Determines if the summary should be shown after assessment completion.
       * @returns {Promise<{ summary: string; didFinish: boolean }>} - A promise that resolves with an object containing the summary and a flag indicating if the assessment finished.
       */
      var result = await startCustomAssessment(assessment, null, true, false);
      console.log(result.summary);
      console.log(result.didFinish);
    }catch(e){
      console.error(e);
      showAlert("Custom workout error", e + "");
    }
  }

}

const styles = StyleSheet.create({
  sdk:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 10,
    elevation: 2,
    borderColor: "blue",
    borderWidth: 1,
    margin: 5
  },
  textStyle: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default App;
