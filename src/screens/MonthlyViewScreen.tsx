import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useTheme } from '../theme/provider';
import { getEntriesByMonth, Entry } from '../storage/localStorage';
import { EntryCard, DatePicker } from '../components/composite';
import { Background } from '../components/base';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MonthlyView'>;
type MonthlyViewScreenRouteProp = RouteProp<RootStackParamList, 'MonthlyView'>;

const MonthlyViewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MonthlyViewScreenRouteProp>();
  const { theme } = useTheme();
  
  // States
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(route.params.year, route.params.month, 1)
  );
  
  // Load entries for the selected month
  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const monthEntries = await getEntriesByMonth(
          selectedDate.getMonth(),
          selectedDate.getFullYear()
        );
        // Sort by date, newest first
        const sortedEntries = monthEntries.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sortedEntries);
      } catch (error) {
        console.error('Error loading monthly entries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEntries();
  }, [selectedDate]);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle month change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  return (
    <Background showWaves={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>Back</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
          </Text>
          
          <View style={styles.placeholderButton} />
        </View>
        
        <View style={styles.content}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            label="Select Month"
            style={styles.datePicker}
          />
          
          {loading ? (
            <ActivityIndicator 
              size="large" 
              color={theme.colors.primary} 
              style={styles.loader}
            />
          ) : entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ color: theme.colors.text.secondary }}>
                No entries for {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}.
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.entriesCount, { color: theme.colors.text.secondary }]}>
                {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
              </Text>
              
              <FlatList
                data={entries}
                renderItem={({ item }) => (
                  <EntryCard
                    id={item.id}
                    date={formatDate(item.date)}
                    preview={item.content.length > 80 
                      ? `${item.content.substring(0, 80)}...` 
                      : item.content}
                    style={{ marginBottom: 12 }}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.entriesList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
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
  placeholderButton: {
    padding: 8,
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  datePicker: {
    marginBottom: 16,
  },
  entriesCount: {
    fontSize: 16,
    marginBottom: 16,
  },
  entriesList: {
    paddingBottom: 24,
  },
  loader: {
    marginVertical: 30,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginTop: 20,
  },
});

export default MonthlyViewScreen;
