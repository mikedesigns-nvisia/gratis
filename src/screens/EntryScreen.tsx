import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../theme/provider';
import { GratitudePrompt } from '../components/composite';
import { saveEntry, getEntryById, Entry } from '../storage/localStorage';
// Custom UUID generator for React Native environments without crypto
const generateUUID = (): string => {
  // Simple implementation that works without crypto
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Entry'>;
type EntryScreenRouteProp = RouteProp<RootStackParamList, 'Entry'>;

const EntryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EntryScreenRouteProp>();
  const { theme } = useTheme();
  
  // States
  const [entryText, setEntryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  
  // Check if editing existing entry
  const isEditing = !!route.params?.id;
  
  // Load entry data if editing
  useEffect(() => {
    const loadEntry = async () => {
      if (isEditing && route.params?.id) {
        setLoading(true);
        try {
          const entry = await getEntryById(route.params.id);
          if (entry) {
            setEntryText(entry.content);
          }
        } catch (error) {
          console.error('Error loading entry:', error);
          Alert.alert('Error', 'Failed to load entry');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadEntry();
  }, [isEditing, route.params?.id]);
  
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const handleSave = async () => {
    if (!entryText.trim()) {
      Alert.alert('Error', 'Please enter some text for your gratitude entry');
      return;
    }
    
    setLoading(true);
    
    try {
      const entryData: Entry = {
        id: isEditing && route.params?.id ? route.params.id : generateUUID(),
        content: entryText,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncedWithServer: false,
      };
      
      await saveEntry(entryData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save your entry');
      setLoading(false);
    }
  };
  
  // Handle selecting a prompt
  const handleSelectPrompt = (prompt: string) => {
    setEntryText(entryText ? `${entryText}\n\n${prompt}\n` : `${prompt}\n`);
    setShowPrompts(false);
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            {isEditing ? 'Edit Entry' : 'New Entry'}
          </Text>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
            {formattedDate}
          </Text>
          
          <View style={styles.promptContainer}>
            <Text style={[styles.promptText, { color: theme.colors.text.primary }]}>
              What's good today?
            </Text>
            
            <TouchableOpacity 
              style={[styles.inspirationButton, { borderColor: theme.colors.primary }]}
              onPress={() => setShowPrompts(!showPrompts)}
            >
              <Text style={[styles.inspirationButtonText, { color: theme.colors.primary }]}>
                Need inspiration?
              </Text>
            </TouchableOpacity>
          </View>
          
          {showPrompts && (
            <GratitudePrompt 
              onSelectPrompt={handleSelectPrompt}
              style={styles.gratitudePrompts}
            />
          )}
          
          <TextInput
            style={[styles.entryInput, { color: theme.colors.text.primary }]}
            value={entryText}
            onChangeText={setEntryText}
            multiline
            placeholder="Start typing..."
            placeholderTextColor={theme.colors.text.secondary}
            autoFocus={!isEditing}
            autoCapitalize="sentences"
            keyboardType="default"
            keyboardAppearance={theme.isDark ? 'dark' : 'light'}
            returnKeyType="default"
            blurOnSubmit={false}
            textAlignVertical="top"
            spellCheck={true}
            autoCorrect={true}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 16,
  },
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptText: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
  },
  inspirationButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inspirationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gratitudePrompts: {
    marginBottom: 24,
  },
  entryInput: {
    fontSize: 18,
    lineHeight: 28,
    padding: 0,
    textAlignVertical: 'top',
    height: 300,
  },
});

export default EntryScreen;
