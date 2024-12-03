import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AppNavigator from '../src/navigation/AppNavigator';

const ErrorFallback: React.FC<{ onReload: () => void }> = ({ onReload }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      Something went wrong. Please try again later.
    </Text>
    <Button title="Retry" onPress={onReload} />
  </View>
);

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Optional: Log error to a remote service here
  }

  handleRetry = () => {
    this.setState({ hasError: false }); // Reset the error state
    console.log('Retry triggered...');
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReload={this.handleRetry} />;
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorText: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
});

export default App;
