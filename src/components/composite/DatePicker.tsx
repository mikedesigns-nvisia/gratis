import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Modal, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme/provider';
import Typography from '../base/Typography';
import Button from '../base/Button';
import Card from '../base/Card';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  style,
  minDate,
  maxDate
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate date options
  const generateDateOptions = (): Date[] => {
    const today = new Date();
    const dates: Date[] = [];
    
    // Past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      if (minDate && date < minDate) continue;
      if (maxDate && date > maxDate) continue;
      
      dates.push(date);
    }
    
    return dates;
  };
  
  // Handle date selection
  const handleSelectDate = (date: Date) => {
    onChange(date);
    setShowModal(false);
  };
  
  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    return date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear();
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography 
          variant="label" 
          color={theme.colors.text.secondary} 
          style={styles.label}
        >
          {label}
        </Typography>
      )}
      
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Card
          style={styles.dateDisplay}
          elevation="small"
        >
          <Typography variant="body1">
            {formatDate(value)}
          </Typography>
        </Card>
      </TouchableOpacity>
      
      {/* Simple Date Picker Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: theme.colors.background.primary }
            ]}
          >
            <View style={styles.modalHeader}>
              <Button 
                label="Close" 
                variant="text" 
                onPress={() => setShowModal(false)} 
              />
              <Typography variant="h4">Select Date</Typography>
              <View style={{ width: 70 }} />
            </View>
            
            <ScrollView style={styles.dateList}>
              {generateDateOptions().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    isSelected(date) && { 
                      backgroundColor: theme.colors.primary,
                    }
                  ]}
                  onPress={() => handleSelectDate(date)}
                >
                  <Typography 
                    variant="body1"
                    color={isSelected(date) ? theme.colors.text.inverse : undefined}
                  >
                    {formatDate(date)} {isToday(date) ? '(Today)' : ''}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  dateDisplay: {
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateList: {
    flex: 1,
  },
  dateOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default DatePicker;
