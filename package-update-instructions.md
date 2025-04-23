# Dependency Update Instructions

To complete the Supabase cloud sync integration, you need to install some additional packages. Run the following command in your project directory:

```bash
npm install @react-native-community/netinfo react-native-url-polyfill expo-linking expo-web-browser
```

## Dependencies Added

These are the dependencies needed for the Supabase cloud sync functionality:

1. **@react-native-community/netinfo**: For checking network connectivity status
2. **react-native-url-polyfill**: Required by Supabase for React Native compatibility
3. **expo-linking**: Handles deep links for magic link authentication
4. **expo-web-browser**: Used for opening authentication links

## TypeScript Type Definitions

You may also need to update your TypeScript definitions. If you encounter any type errors, run:

```bash
npm install -D @types/react @types/react-native
```

## Verification

To verify that all dependencies are correctly installed, run:

```bash
npm ls @supabase/supabase-js @react-native-community/netinfo react-native-url-polyfill expo-linking expo-web-browser
```

This should show all of these packages as installed dependencies.
