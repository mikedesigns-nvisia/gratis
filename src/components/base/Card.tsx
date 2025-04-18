import React from 'react';
import { 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
  TouchableOpacity, 
  GestureResponderEvent 
} from 'react-native';
import { useTheme } from '../../theme/provider';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  noPadding?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  contentStyle,
  onPress, 
  elevation = 'small',
  noPadding = false,
  testID 
}) => {
  const { theme } = useTheme();
  
  // Get shadow based on elevation prop
  const getShadowStyle = (): ViewStyle => {
    switch (elevation) {
      case 'none':
        return {};
      case 'small':
        return theme.shapes.shadow.sm;
      case 'medium':
        return theme.shapes.shadow.md;
      case 'large':
        return theme.shapes.shadow.lg;
      default:
        return theme.shapes.shadow.sm;
    }
  };
  
  const shadowStyle = getShadowStyle();
  
  const cardStyles = [
    styles.card,
    { 
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.shapes.borderRadius.md,
    },
    shadowStyle,
    style,
  ];
  
  const contentStyles = [
    styles.content,
    noPadding ? { padding: 0 } : { padding: theme.spacing.md },
    contentStyle,
  ];
  
  // If onPress is provided, wrap in TouchableOpacity, otherwise use View
  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyles} 
        onPress={onPress} 
        activeOpacity={0.7}
        testID={testID}
      >
        <View style={contentStyles}>{children}</View>
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={cardStyles} testID={testID}>
      <View style={contentStyles}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    marginVertical: 8,
  },
  content: {
    // Content styles
  },
});

export default Card;
