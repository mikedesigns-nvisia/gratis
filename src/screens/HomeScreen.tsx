import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../theme/provider';
import { getEntries, Entry } from '../storage/localStorage';
import { EntryCard } from '../components/composite';
import { Background } from '../components/base';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  // States
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get current date
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  
  // Load entries when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadEntries = async () => {
        setLoading(true);
        try {
          const allEntries = await getEntries();
          // Sort by date, newest first
          const sortedEntries = allEntries.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setEntries(sortedEntries);
        } catch (error) {
          console.error('Error loading entries:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadEntries();
      
      // Clean up function
      return () => {};
    }, [])
  );
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if today
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Background showWaves={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Gratis
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
            {month} {year}
          </Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.promptContainer}>
            <Text style={[styles.promptLabel, { color: theme.colors.text.secondary }]}>
              what's good today?
            </Text>
            
            <TouchableOpacity 
              style={[styles.promptButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Entry', {})}
            >
              <Text style={[styles.promptButtonText, { color: theme.colors.text.inverse }]}>
                Create New Entry
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentEntriesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Recent Entries
            </Text>
            
            {loading ? (
              <ActivityIndicator 
                size="large" 
                color={theme.colors.primary} 
                style={styles.loader}
              />
            ) : entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ color: theme.colors.text.secondary }}>
                  No entries yet. Start by adding your first gratitude entry!
                </Text>
              </View>
            ) : (
              entries.slice(0, 5).map((entry) => (
                <EntryCard
                  key={entry.id}
                  id={entry.id}
                  date={formatDate(entry.date)}
                  preview={entry.content.length > 80 
                    ? `${entry.content.substring(0, 80)}...` 
                    : entry.content}
                  style={{ marginBottom: 12 }}
                />
              ))
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => navigation.navigate('MonthlyView', { month: today.getMonth(), year })}
          >
            <Text style={[styles.footerButtonText, { color: theme.colors.primary }]}>
              View All Entries
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  promptContainer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  promptLabel: {
    fontSize: 18,
    marginBottom: 16,
  },
  promptButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  promptButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentEntriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  footerButton: {
    paddingVertical: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
