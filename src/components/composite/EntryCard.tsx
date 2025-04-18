import React from 'react';
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useTheme } from '../../theme/provider';
import Card from '../base/Card';
import Typography from '../base/Typography';

interface EntryCardProps {
  id: string;
  date: string;
  preview: string;
  style?: StyleProp<ViewStyle>;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EntryCard: React.FC<EntryCardProps> = ({
  id,
  date,
  preview,
  style,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  const handlePress = () => {
    navigation.navigate('Entry', { id });
  };
  
  return (
    <Card 
      onPress={handlePress}
      style={[styles.container, style]}
      elevation="small"
    >
      <View>
        <Typography 
          variant="caption" 
          color={theme.colors.text.secondary}
          style={styles.date}
        >
          {date}
        </Typography>
        
        <Typography 
          variant="body1" 
          numberOfLines={2}
          style={styles.preview}
        >
          {preview}
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 4,
  },
  preview: {
    lineHeight: 22,
  },
});

export default EntryCard;
