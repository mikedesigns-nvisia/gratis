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

// Fix local component props
declare module './src/theme/provider' {
  export interface ThemeProviderProps {
    children?: React.ReactNode;
  }
}

declare module './src/context/AuthContext' {
  export interface AuthProviderProps {
    children?: React.ReactNode;
  }
}

// For any React component that might be missing children prop
declare namespace React {
  interface ComponentProps<T> {
    children?: React.ReactNode;
  }
}

// Set any JSX elements to accept children
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
