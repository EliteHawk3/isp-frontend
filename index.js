/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App'; // Ensure this is the correct path to your App component
import { name as appName } from './app.json'; // Name of the app
import { LogBox } from 'react-native';

console.log('Initializing App...'); // Log to confirm entry point

// Ignore specific warnings during development (optional)
LogBox.ignoreLogs(['Warning: ...']); // Adjust the pattern as needed

// Global error handler for uncaught exceptions (optional for production stability)
if (__DEV__) {
  console.log('Running in development mode...');
} else {
  console.log('Running in production mode...');
  const defaultHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Uncaught exception:', { error, isFatal });
    // Optional: Report error to an analytics or error-reporting service here
    defaultHandler(error, isFatal); // Pass to default handler
  });
}

// Register the app with the root component
AppRegistry.registerComponent(appName, () => App);
