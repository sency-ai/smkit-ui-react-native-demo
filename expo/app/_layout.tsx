import { Stack } from 'expo-router';

export default function RootLayout() {
  // The shared demo App draws its own screens and safe areas.
  return <Stack screenOptions={{ headerShown: false }} />;
}
