import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme } from '../../theme/provider';

type TypographyVariant = 
  | 'h1'  // Largest heading
  | 'h2'  // Section heading
  | 'h3'  // Subsection heading
  | 'h4'  // Small heading
  | 'body1' // Standard body text
  | 'body2' // Smaller body text
  | 'label' // Form labels or small headings
  | 'caption'; // Small text for captions or hints

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  gutterBottom?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  style,
  color,
  align = 'left',
  numberOfLines,
  gutterBottom = false,
}) => {
  const { theme } = useTheme();
  
  // Get variant-specific styles
  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize.xxxl,
          fontWeight: '700', // Bold
          lineHeight: theme.typography.fontSize.xxxl * theme.typography.lineHeight.tight,
          fontFamily: theme.typography.fontFamily.bold, // Inter-Bold
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: '700', // Bold
          lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
          fontFamily: theme.typography.fontFamily.bold, // Inter-Bold
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: '600', // SemiBold
          lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.tight,
          fontFamily: theme.typography.fontFamily.bold, // Inter-Bold
        };
      case 'h4':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: '600', // SemiBold
          lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.tight,
          fontFamily: theme.typography.fontFamily.secondary, // Inter-Medium
        };
      case 'body1':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: '400', // Regular
          lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
          fontFamily: theme.typography.fontFamily.primary, // Inter
        };
      case 'body2':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: '400', // Regular
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
          fontFamily: theme.typography.fontFamily.primary, // Inter
        };
      case 'label':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: '500', // Medium
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
          fontFamily: theme.typography.fontFamily.secondary, // Inter-Medium
          letterSpacing: theme.typography.letterSpacing.wide,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: '400', // Regular
          lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
          fontFamily: theme.typography.fontFamily.primary, // Inter
        };
      default:
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: '400', // Regular
          lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
          fontFamily: theme.typography.fontFamily.primary, // Inter
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  // Combined styles
  const textStyles = [
    styles.text,
    variantStyles,
    {
      color: color || theme.colors.text.primary,
      textAlign: align,
      marginBottom: gutterBottom ? theme.spacing.md : 0,
    },
    style,
  ];
  
  return (
    <Text style={textStyles} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Base text styles
  },
});

export default Typography;
