// Type definitions to fix compatibility issues

import 'react-native';
import '@react-navigation/native';

// Fix React Navigation typings
declare module '@react-navigation/native' {
  export interface NavigationContainerProps {
    children?: React.ReactNode;
  }
}

// Fix React-Native typings
declare module 'react-native' {
  interface ViewProps {
    children?: React.ReactNode;
  }
}

// Fix for Provider components
declare module 'react-native-safe-area-context' {
  export interface SafeAreaProviderProps {
    children?: React.ReactNode;
  }
}
