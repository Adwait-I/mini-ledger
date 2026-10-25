import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { CreateLoanPayload } from '../types';
import { ReceiptPicker } from './ReceiptPicker';
import { Ionicons } from '@expo/vector-icons';

interface AddLoanModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLoanPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    // Default due date: 7 days from today
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  // Quick preset helper for due dates
  const setQuickDueDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleReset = () => {
    setFriendName('');
    setAmount('');
    setReceiptUrl(null);
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = async () => {
    if (!friendName.trim()) {
      showAlert('Validation Error', 'Please enter your friend’s name.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert('Validation Error', 'Please enter a valid loan amount greater than 0.');
      return;
    }

    if (!dueDate || isNaN(Date.parse(dueDate))) {
      showAlert('Validation Error', 'Please specify a valid due date (YYYY-MM-DD).');
      return;
    }

    try {
      await onSubmit({
        friendName: friendName.trim(),
        amount: parsedAmount,
        dueDate: new Date(dueDate).toISOString(),
        receiptUrl,
      });
      handleReset();
      onClose();
    } catch (err: any) {
      showAlert('Error', err?.response?.data?.details?.[0]?.message || err?.response?.data?.error || 'Failed to save loan entry');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalSheet}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>New Loan Entry</Text>
              <Text style={styles.headerSubtitle}>Record money lent to a friend</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
            {/* Friend Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Friend's Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Alex Johnson"
                  placeholderTextColor={colors.textMuted}
                  value={friendName}
                  onChangeText={setFriendName}
                />
              </View>
            </View>

            {/* Loan Amount */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Amount Lent (₹)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            {/* Due Date & Quick Presets */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="2026-11-01"
                  placeholderTextColor={colors.textMuted}
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </View>

              {/* Quick Preset Buttons */}
              <View style={styles.presetsRow}>
                <TouchableOpacity style={styles.presetChip} onPress={() => setQuickDueDate(3)}>
                  <Text style={styles.presetChipText}>+3 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetChip} onPress={() => setQuickDueDate(7)}>
                  <Text style={styles.presetChipText}>+1 Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetChip} onPress={() => setQuickDueDate(14)}>
                  <Text style={styles.presetChipText}>+2 Weeks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetChip} onPress={() => setQuickDueDate(30)}>
                  <Text style={styles.presetChipText}>+1 Month</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Receipt Photo Picker */}
            <ReceiptPicker receiptUri={receiptUrl} onReceiptSelected={setReceiptUrl} />

            {/* Save Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color={colors.textLight} />
                  <Text style={styles.submitButtonText}>Create Loan Entry</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
  },
  formContainer: {
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 52,
    marginTop: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
