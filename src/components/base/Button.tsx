import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '../../theme/provider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  labelStyle,
  icon,
  iconPosition = 'left',
}) => {
  const { theme } = useTheme();
  
  // Get button styling based on variant
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          padding: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
    }
  };
  
  // Get text styling based on variant
  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return {
          color: theme.colors.text.inverse,
        };
      case 'secondary':
        return {
          color: theme.colors.text.inverse,
        };
      case 'outline':
        return {
          color: theme.colors.primary,
        };
      case 'text':
        return {
          color: theme.colors.primary,
        };
      default:
        return {
          color: theme.colors.text.inverse,
        };
    }
  };
  
  // Get size-related styles
  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          button: {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.shapes.borderRadius.sm,
          },
          text: {
            fontSize: theme.typography.fontSize.sm,
          },
        };
      case 'medium':
        return {
          button: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.shapes.borderRadius.md,
          },
          text: {
            fontSize: theme.typography.fontSize.md,
          },
        };
      case 'large':
        return {
          button: {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
            borderRadius: theme.shapes.borderRadius.lg,
          },
          text: {
            fontSize: theme.typography.fontSize.lg,
          },
        };
      default:
        return {
          button: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.shapes.borderRadius.md,
          },
          text: {
            fontSize: theme.typography.fontSize.md,
          },
        };
    }
  };
  
  const buttonVariantStyles = getButtonStyles();
  const textVariantStyles = getTextStyles();
  const sizeStyles = getSizeStyles();
  
  // Combined styles
  const buttonStyles = [
    styles.button,
    buttonVariantStyles,
    sizeStyles.button,
    disabled && styles.buttonDisabled,
    style,
  ];
  
  const textStyles = [
    styles.text,
    textVariantStyles,
    sizeStyles.text,
    disabled && styles.textDisabled,
    labelStyle,
  ];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? theme.colors.primary : theme.colors.text.inverse} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{label}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default Button;
