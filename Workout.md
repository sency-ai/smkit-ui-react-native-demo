# Workout

> The customized workout enables you to create a personalized workout session using the exercises and movements from our [Movement catalog](https://github.com/sency-ai/smkit-sdk/blob/main/SDK-Movement-Catalog.md), tailored to your professional standards or personal preferences.

Import the sdk and it's main functions

```js
import {
  startAssessment,
  startCustomWorkout,
  AssessmentTypes,
  startWorkoutProgram,
} from '@sency/react-native-smkit-ui/src/index.tsx';
import * as SMWorkoutLibrary from '@sency/react-native-smkit-ui/src/SMWorkout.tsx';
```

### Start Custom Workout

**Listen to Assessment's Callbacks** in order to recieve callbacks from our SDK you need to configure listeners:

```js
useEffect(() => {
  const didExitWorkoutSubscription = DeviceEventEmitter.addListener(
    'didExitWorkout',
    params => {
      console.log(
        'Received didExitWorkout event with message:',
        params.summary,
      );
    },
  );

  const workoutDidFinishSubscription = DeviceEventEmitter.addListener(
    'workoutDidFinish',
    params => {
      console.log(
        'Received workoutDidFinish event with message:',
        params.summary,
      );
    },
  );

  const workoutErrorSubscription = DeviceEventEmitter.addListener(
    'workoutError',
    params => {
      console.log('Received workoutError event with message:', params.error);
    },
  );

  const exerciseDidFinishSubscription = DeviceEventEmitter.addListener(
    'exerciseDidFinish',
    params => {
      console.log(
        'Received exerciseDidFinish event with message:',
        params.data,
      );
    },
  );

  // Clean up subscription
  return () => {
    didExitWorkoutSubscription.remove();
    workoutDidFinishSubscription.remove();
    workoutErrorSubscription.remove();
    exerciseDidFinishSubscription.remove();
  };
}, []);
```

**startWorkout** starts a custom workout.

```js
async function startSMKitUICustomWorkout(){
  try{
    // list of exercies
    var exercises = [
      new SMWorkoutLibrary.SMExercise(
        name: "First Exercise", // => name:string | null
        35,                     // => totalSeconds: number | null
        null,                   // => videoInstruction: string | null (url for a video)
        null,                   // => exerciseIntro: string | null (url for a sound)
        [SMWorkoutLibrary.UIElement.RepsCounter, SMWorkoutLibrary.UIElement.Timer], // => uiElements: UIElement[] | null
        "HighKnees", // => detector: string
        true, // => repBased: boolean | null
        null, // => exerciseClosure: string | null (url for a sound)
        null, // => scoringParams: SMWorkoutLibrary.SMScoringParams | null
      ),
      new SMWorkoutLibrary.SMExercise(
        "Second Exercise", // => name:string | null
        25, // => totalSeconds: number | null
        null, // => videoInstruction: string | null (url for a video)
        null, // => exerciseIntro: string | null (url for a sound)
        [SMWorkoutLibrary.UIElement.GaugeOfMotion, SMWorkoutLibrary.UIElement.Timer], // => uiElements: UIElement[] | null
        "SquatRegularOverheadStatic", // => detector: string
        false, // => repBased: boolean | null
        null, // => exerciseClosure: string | null (url for a sound)
        null, // => scoringParams: SMWorkoutLibrary.SMScoringParams | null
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
  }
}
```
