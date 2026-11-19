import { useState } from 'react';
import { Button, PermissionsAndroid, Platform, Text, TextInput, View } from 'react-native';
import { configure, getSupportedMovements, startAssessment, startCustomWorkout, startPacer, SMWorkoutLibrary } from '@sency/react-native-smkit-ui';

export default function AssessmentScreen() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('Enter a key to configure the SDK.');



  async function run(mode: 'assessment' | 'eccentric' | 'combo' | 'pacer' | 'flow') {
    setBusy(true);
    try {
      if (Platform.OS === 'android' && await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA) !== 'granted') {
        setStatus('Camera access is required.');
        return;
      }
      setStatus('Configuring SDK…');
      await configure(key.trim());
      const movements = await getSupportedMovements();
      setBridgeStatus(`Native SDK responded (${movements.length} movements).`);
      if (mode === 'pacer') {
        setStatus('Opening standalone pacer…');
        const result = await startPacer({
          timingMode: 'exactBeat',
          blocks: [{ detector: 'SquatRegular', durationSeconds: 30, secondsPerRep: 3 }],
        });
        setStatus(result.didFinish ? 'Pacer completed' : 'Pacer exited');
      } else if (mode === 'flow') {
        const { SMExercise, SMWorkout } = SMWorkoutLibrary;
        const flow = SMExercise.mobilityFlow({ blocks: [
          { detector: 'RhomboidStretch', repetitions: 1, secondsPerRep: 10 },
          { detector: 'ButterflyPose', mobilityRepConfig: { targetReps: 3 } },
        ] });
        const workout = new SMWorkout('mobility-flow', 'Mobility Flow', null, null, [flow], null, null, null);
        setStatus('Opening Mobility Flow…');
        const result = await startCustomWorkout(workout, null);
        setStatus(result.didFinish ? 'Mobility Flow completed' : 'Mobility Flow exited');
      } else if (mode !== 'assessment') {
        const { SMExercise, SMWorkout, UIElement } = SMWorkoutLibrary;
        const isCombo = mode === 'combo';
        const name = isCombo ? 'Squat and hip abduction' : 'Eccentric squat';
        const exercise = isCombo ? new SMExercise(name, 60, null, 'ComboSequenceIntro',
          [UIElement.RepsCounter, UIElement.Timer], 'Combo04', null, null,
          { guidanceMode: false, targetReps: 5, combinationOptions: { firstReps: 2, secondReps: 1, fixedSide: 'left' } })
          : new SMExercise('Eccentric squat', 60, 'SquatRegular', null,
          [UIElement.RepsCounter, UIElement.Timer], 'SquatRegular', null, null,
          { targetReps: 5, eccentricConfig: { eccentricSeconds: 3 } });
        const workout = new SMWorkout(isCombo ? 'combo-04' : 'eccentric-squat', name, null, null, [exercise], null, null, null);
        setStatus(`Opening ${name}…`);
        const result = await startCustomWorkout(workout, null);
        setStatus(result.didFinish ? 'Workout completed' : 'Workout exited');
      } else {
        setStatus('Opening assessment…');
        const result = await startAssessment(SMWorkoutLibrary.AssessmentTypes.Fitness, false, null, false, '', null);
        setStatus(result.didFinish ? 'Assessment completed' : 'Assessment exited');
      }
    } catch (error) {
      setStatus(String(error));
    } finally {
      setBusy(false);
    }
  }

  return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
    <Text selectable>{bridgeStatus}</Text>
    <TextInput accessibilityLabel="Sency SDK key" placeholder="Sency SDK key" secureTextEntry autoCapitalize="none" autoCorrect={false} value={key} onChangeText={setKey} />
    <Button title="Start fitness assessment" disabled={busy || !key.trim()} onPress={() => run('assessment')} />
    <Button title="Start eccentric squat" disabled={busy || !key.trim()} onPress={() => run('eccentric')} />
    <Button title="Start squat and hip abduction combo" disabled={busy || !key.trim()} onPress={() => run('combo')} />
    <Button title="Start standalone pacer" disabled={busy || !key.trim()} onPress={() => run('pacer')} />
    <Button title="Start Mobility Flow" disabled={busy || !key.trim()} onPress={() => run('flow')} />
    <Text selectable>{status}</Text>
  </View>;
}
