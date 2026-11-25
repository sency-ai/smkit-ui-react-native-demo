// Expo stand-in for react-native-config, which the shared demo App reads its key from.
// Expo builds EXPO_PUBLIC_ variables from expo/.env (Git-ignored) into the bundle.
const Config = {
  API_PUBLIC_KEY: process.env.EXPO_PUBLIC_API_PUBLIC_KEY,
  CUSTOMER_CODE: process.env.EXPO_PUBLIC_CUSTOMER_CODE,
};

export default Config;
