import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/provider';
import Typography from '../base/Typography';
import Card from '../base/Card';

// Sample prompt suggestions
const DEFAULT_PROMPTS = [
  "What made me smile today?",
  "Who am I grateful for today?",
  "What's something beautiful I saw today?",
  "What's a small victory I had today?",
  "What's something I learned today?",
  "What made today unique?",
  "What's something I'm looking forward to?",
  "What's a challenge I overcame today?",
];

interface GratitudePromptProps {
  onSelectPrompt: (prompt: string) => void;
  style?: StyleProp<ViewStyle>;
  customPrompts?: string[];
}

export const GratitudePrompt: React.FC<GratitudePromptProps> = ({
  onSelectPrompt,
  style,
  customPrompts,
}) => {
  const { theme } = useTheme();
  const [prompts] = useState(customPrompts || DEFAULT_PROMPTS);
  
  // Get 3 random prompts
  const getRandomPrompts = (count: number = 3): string[] => {
    const shuffled = [...prompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const [displayedPrompts] = useState(getRandomPrompts());
  
  return (
    <View style={[styles.container, style]}>
      <Typography variant="label" gutterBottom>
        NEED INSPIRATION?
      </Typography>
      
      {displayedPrompts.map((prompt, index) => (
        <Card 
          key={index}
          style={[
            styles.promptCard,
            { backgroundColor: theme.colors.background.secondary }
          ]}
          onPress={() => onSelectPrompt(prompt)}
        >
          <Typography variant="body1">{prompt}</Typography>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  promptCard: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default GratitudePrompt;
