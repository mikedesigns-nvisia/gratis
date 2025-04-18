import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import tokens from './tokens';

// Create light and dark themes based on our tokens
const createTheme = (isDark: boolean) => {
  const colorTokens = isDark ? tokens.darkColors : tokens.colors;
  
  return {
    colors: colorTokens,
    typography: tokens.typography,
    spacing: tokens.spacing,
    shapes: tokens.shapes,
    isDark,
  };
};

// Create the context
type ThemeContextType = {
  theme: ReturnType<typeof createTheme>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get device color scheme
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // Update theme when device theme changes
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);
  
  // Create theme based on dark/light mode
  const theme = createTheme(isDark);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  // Create Paper theme from our theme
  const paperTheme = {
    colors: {
      primary: theme.colors.primary,
      accent: theme.colors.secondary,
      background: theme.colors.background.primary,
      surface: theme.colors.background.secondary,
      text: theme.colors.text.primary,
      disabled: theme.colors.text.secondary,
      placeholder: theme.colors.text.secondary,
      backdrop: 'rgba(0, 0, 0, 0.5)',
      notification: theme.colors.status.error,
    },
    dark: isDark,
    roundness: theme.shapes.borderRadius.md,
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use theme in components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
