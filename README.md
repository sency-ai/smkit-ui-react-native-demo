# [react-native-smkit-ui demo](https://github.com/sency-ai/smkit-sdk)

- [npm](https://www.npmjs.com/package/@sency/react-native-smkit-ui)

## Version: 2.0.4

1. [ Installation ](#inst)
2. [ Setup ](#setup)
3. [ API ](#api)
4. [ UI Customization & Phone Calibration ](#ui-customization)
5. [ Data ](#data)

<a name="inst"></a>

## 1. Installation

run `npm install @sency/react-native-smkit-ui`

## 2. Setup <a name="setup"></a>

- [iOS](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/docs/ios-setup.md)
- [Android](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/docs/android-setup.md)

## 3. API<a name="api"></a>

### 1. Configure <a name="conf"></a>

```js
[1] First import configure
import { configure } from '@sency/react-native-smkit-ui/src/index.tsx';

[2] then call the configure function with your auth key
try{
  var res = await configure("YOUR_AUTH_KEY");
 }catch (e) {
  console.error(e);
}
```

To reduce wait time we recommend to call `configure` on app launch.

**⚠️ smkit_ui_library will not work if you don't first call configure.**

## 4. UI Customization & Phone Calibration <a name="ui-customization"></a>

Starting from version 2.0.4, you can customize the UI theme colors and configure phone calibration settings using the `modifications` parameter. This parameter is available in all workout and assessment functions.

### Modifications Parameter

The `modifications` parameter is a JSON string that allows you to configure:

- **UI Theme Colors**: Customize the primary color of the UI
- **Phone Calibration**: Enable/disable and configure phone calibration settings

### Example Usage

```js
// Create a modifications configuration function
const getModifications = () => {
  return JSON.stringify({
    primaryColor: 'green', // Use color names: 'green', 'blue', 'orange', 'purple', 'red', 'silver', 'gold', 'pink'
    phoneCalibration: {
      enabled: true,
      autoCalibrate: false,
      calibrationSensitivity: 0.8,
    },
    showProgressBar: true,
    showCounters: true,
  });
};

// Use with startAssessment
var result = await startAssessment(
  AssessmentTypes.Fitness,
  true,
  null,
  false,
  '',
  getModifications() // Pass modifications here
);

// Use with startWorkoutProgram
var config = new WorkoutConfig(week, bodyZone, difficulty, duration, language, programId);
var result = await startWorkoutProgram(config, getModifications());

// Use with startCustomWorkout
var result = await startCustomWorkout(workout, getModifications());

// Use with startCustomAssessment
var result = await startCustomAssessment(assessment, null, false, true, getModifications());
```

## 2. Start <a name="start"></a>

#### [Start Assessment](#data)

- [Start Assessment](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/Assessment.md)

- [Start Workout](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/Workout.md)

- [Build Your Own Assessment](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/CustomizedAssessment.md)

- [Workout From Program](https://github.com/sency-ai/smkit-ui-react-native-demo/blob/main/wfp.md)

##Data <a name="data"></a>

### AssessmentTypes

| Name (enum) | Description                                                                                                                                                                    | More info                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Fitness     | For individuals of any activity level who seek to enhance their physical abilities, strength, and endurance through a tailored plan.                                           | [Link](https://github.com/sency-ai/smkit-sdk/blob/main/Assessments/AI-Fitness-Assessment.md) |
| Body360     | Designed for individuals of any age and activity level, this assessment determines the need for a preventative plan or medical support.                                        | [Link](https://github.com/sency-ai/smkit-sdk/blob/main/Assessments/360-Body-Assessment.md)   |
| Strength    | For individuals of any activity level who seek to assess their strength capabilities (core and endurance) \* This assessment will be available soon. Contact us for more info. | [Link](https://github.com/sency-ai/smkit-sdk/blob/main/Assessments/Strength.md)              |
| Cardio      | For individuals of any activity level who seek to assess their cardiovascular capabilities \* This assessment will be available soon. Contact us for more info.                | [Link](https://github.com/sency-ai/smkit-sdk/blob/main/Assessments/Cardio.md)                |
| Custom      | If Sency created a tailored assessment for you, you probably know it, and you should use this enum.                                                                            |                                                                                              |

Having issues? [Contact us](mailto:support@sency.ai) and let us know what the problem is.
