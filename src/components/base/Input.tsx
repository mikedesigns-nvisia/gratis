import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme/provider';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  helper,
  containerStyle,
  inputStyle,
  maxLength,
  showCharCount = false,
  value,
  ...rest
}) => {
  const { theme } = useTheme();
  
  const isError = !!error;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isError ? theme.colors.status.error : theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.secondary, // Inter-Medium
            },
          ]}
        >
          {label}
        </Text>
      )}
      
      <TextInput
        style={[
          styles.input,
          {
            borderColor: isError ? theme.colors.status.error : theme.colors.divider,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary, // Inter
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary}
        maxLength={maxLength}
        value={value}
        {...rest}
      />
      
      <View style={styles.bottomContainer}>
        {(error || helper) && (
          <Text
            style={[
              styles.helperText,
              {
                color: isError ? theme.colors.status.error : theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.primary, // Inter
              },
            ]}
          >
            {error || helper}
          </Text>
        )}
        
        {showCharCount && maxLength && (
          <Text
            style={[
              styles.charCount,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.primary, // Inter
              },
            ]}
          >
            {value ? value.length : 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default Input;
