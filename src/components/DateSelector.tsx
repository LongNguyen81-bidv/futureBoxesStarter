/**
 * DateSelector Component
 *
 * Allows users to select unlock date/time with:
 * - Quick preset buttons (1 week, 1 month, 1 year)
 * - Custom date/time picker
 * - Validation for future dates only
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, addWeeks, addMonths, addYears, isBefore } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { UIColors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, TouchTarget } from '../constants/theme';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

type PresetType = '1week' | '1month' | '1year' | 'custom';

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null);

  const handlePresetSelect = (preset: PresetType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const now = new Date();
    let newDate: Date;

    switch (preset) {
      case '1week':
        newDate = addWeeks(now, 1);
        break;
      case '1month':
        newDate = addMonths(now, 1);
        break;
      case '1year':
        newDate = addYears(now, 1);
        break;
      case 'custom':
        // Open picker with current selected date or 1 week from now
        setShowPicker(true);
        setSelectedPreset('custom');
        return;
      default:
        return;
    }

    setSelectedPreset(preset);
    onDateChange(newDate);
  };

  const handleDatePickerChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (date) {
      // Validate future date
      if (isBefore(date, new Date())) {
        Alert.alert('Ngày không hợp lệ', 'Vui lòng chọn ngày trong tương lai.');
        return;
      }

      onDateChange(date);
      setSelectedPreset('custom');
    }
  };

  const handleCustomPress = () => {
    setShowPicker(true);
    setSelectedPreset('custom');
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Chưa chọn';
    return format(selectedDate, "dd/MM/yyyy 'lúc' HH:mm");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Khi nào mở khóa?</Text>

      {/* Preset Buttons */}
      <View style={styles.presetsRow}>
        <TouchableOpacity
          style={[
            styles.presetButton,
            selectedPreset === '1week' && styles.presetButtonSelected,
          ]}
          onPress={() => handlePresetSelect('1week')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.presetButtonText,
              selectedPreset === '1week' && styles.presetButtonTextSelected,
            ]}
          >
            1 tuần
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetButton,
            selectedPreset === '1month' && styles.presetButtonSelected,
          ]}
          onPress={() => handlePresetSelect('1month')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.presetButtonText,
              selectedPreset === '1month' && styles.presetButtonTextSelected,
            ]}
          >
            1 tháng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetButton,
            selectedPreset === '1year' && styles.presetButtonSelected,
          ]}
          onPress={() => handlePresetSelect('1year')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.presetButtonText,
              selectedPreset === '1year' && styles.presetButtonTextSelected,
            ]}
          >
            1 năm
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Date Picker Button */}
      <TouchableOpacity
        style={[
          styles.customButton,
          selectedPreset === 'custom' && styles.customButtonSelected,
        ]}
        onPress={handleCustomPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={selectedPreset === 'custom' ? UIColors.primary : UIColors.textSecondary}
        />
        <Text
          style={[
            styles.customButtonText,
            selectedPreset === 'custom' && styles.customButtonTextSelected,
          ]}
        >
          Tùy chỉnh ngày & giờ
        </Text>
      </TouchableOpacity>

      {/* Selected Date Display */}
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={UIColors.primary}
          />
          <Text style={styles.selectedDateText}>Mở vào: {formatSelectedDate()}</Text>
        </View>
      )}

      {/* Date Time Picker Modal */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate || addWeeks(new Date(), 1)}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDatePickerChange}
          minimumDate={new Date()}
        />
      )}

      {/* iOS Done Button */}
      {showPicker && Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => setShowPicker(false)}
        >
          <Text style={styles.doneButtonText}>Xong</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: UIColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  presetButton: {
    flex: 1,
    height: 40,
    marginHorizontal: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: UIColors.border,
    backgroundColor: UIColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetButtonSelected: {
    backgroundColor: UIColors.primary,
    borderColor: UIColors.primary,
  },
  presetButtonText: {
    ...Typography.buttonSmall,
    color: UIColors.textSecondary,
  },
  presetButtonTextSelected: {
    color: UIColors.textWhite,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: TouchTarget.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: UIColors.border,
    backgroundColor: UIColors.background,
    paddingHorizontal: Spacing.md,
  },
  customButtonSelected: {
    borderColor: UIColors.primary,
    borderWidth: 2,
  },
  customButtonText: {
    ...Typography.button,
    color: UIColors.textSecondary,
    marginLeft: Spacing.sm,
  },
  customButtonTextSelected: {
    color: UIColors.primary,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: UIColors.primaryLight + '20',
    borderRadius: BorderRadius.sm,
  },
  selectedDateText: {
    ...Typography.bodySmall,
    color: UIColors.primary,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  doneButton: {
    marginTop: Spacing.sm,
    height: TouchTarget.default,
    backgroundColor: UIColors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    ...Typography.button,
    color: UIColors.textWhite,
  },
});

export default DateSelector;
