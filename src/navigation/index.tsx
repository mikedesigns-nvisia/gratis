import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import EntryScreen from '../screens/EntryScreen';
import MonthlyViewScreen from '../screens/MonthlyViewScreen';
import AuthScreen from '../screens/AuthScreen';
import { useTheme } from '../theme/provider';

// Define the navigation types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Home: undefined;
  Entry: { id?: string }; // Optional id for editing existing entry
  MonthlyView: { month: number; year: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  
  // Check if this is the first app launch
  useEffect(() => {
    // In a real app, you would check AsyncStorage for a flag
    // For now, we'll just simulate it
    const checkFirstLaunch = async () => {
      // Simulate checking storage
      setTimeout(() => {
        setIsFirstLaunch(false); // Set to true to show onboarding
      }, 500);
    };
    
    checkFirstLaunch();
  }, []);
  
  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isFirstLaunch ? "Splash" : user ? "Home" : "Auth"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Always available screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Auth flow */}
        {!user ? (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        ) : null}
        
        {/* Main app screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="MonthlyView" component={MonthlyViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
