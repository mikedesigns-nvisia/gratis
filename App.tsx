import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text, LogBox } from 'react-native';
import * as Font from 'expo-font';
import { ThemeProvider } from './src/theme/provider';
import Navigation from './src/navigation';
import 'react-native-url-polyfill/auto';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'Failed to get size for image',
  'Constants.manifest',
]);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontsError, setFontsError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Use simpler font names to avoid registration issues
        await Font.loadAsync({
          'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
          'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsError(error as Error);
        // Still set fonts as loaded, we'll use system fonts as fallback
        setFontsLoaded(true);
      }
    }
    
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading Gratis...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Simple error boundary component to catch errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Navigation error:', error);
    console.log('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Something went wrong.</Text>
          <Text style={{ color: 'red', marginBottom: 20 }}>{this.state.error?.message}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
