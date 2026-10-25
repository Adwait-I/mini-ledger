import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen: React.FC = () => {
  const { requestOtp, login, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRequestOtp = async () => {
    setBanner(null);
    if (!phoneNumber.trim() || phoneNumber.length < 5) {
      setBanner({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }

    try {
      await requestOtp(phoneNumber);
      setOtpSent(true);
      setOtp(''); // User must manually type the OTP!
      setBanner({
        type: 'success',
        text: 'OTP printed in server log! Check your backend terminal and manually type the 6 digits below.',
      });
    } catch (err: any) {
      console.error('Request OTP error:', err);
      const msg =
        err?.response?.data?.details?.[0]?.message ||
        err?.response?.data?.error ||
        (err?.message?.includes('Network')
          ? 'Cannot connect to backend at http://localhost:5001. Ensure backend is running!'
          : err?.message || 'Failed to request OTP');
      setBanner({ type: 'error', text: msg });
    }
  };

  const handleVerifyOtp = async () => {
    setBanner(null);
    if (!otp.trim() || otp.length !== 6) {
      setBanner({ type: 'error', text: 'Please enter the 6-digit numeric OTP code from your server log.' });
      return;
    }

    try {
      await login(phoneNumber, otp);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const msg =
        err?.response?.data?.details?.[0]?.message ||
        err?.response?.data?.error ||
        'Invalid or expired OTP code. Please check the code in your server log.';
      setBanner({ type: 'error', text: msg });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.content}>
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="wallet" size={36} color={colors.primary} />
            </View>
            <Text style={styles.appName}>MiniLedger</Text>
            <Text style={styles.appTagline}>Keep track of loans & repayments effortlessly</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {banner && (
              <View
                style={[
                  styles.bannerBox,
                  banner.type === 'success' ? styles.bannerSuccess : styles.bannerError,
                ]}
              >
                <Ionicons
                  name={banner.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={banner.type === 'success' ? colors.primaryDark : colors.danger}
                />
                <Text
                  style={[
                    styles.bannerText,
                    banner.type === 'success' ? styles.bannerSuccessText : styles.bannerErrorText,
                  ]}
                >
                  {banner.text}
                </Text>
              </View>
            )}

            <Text style={styles.cardTitle}>
              {otpSent ? 'Verify Phone Number' : 'Sign in with Phone'}
            </Text>
            <Text style={styles.cardDescription}>
              {otpSent
                ? `Enter the 6-digit verification code sent to ${phoneNumber}`
                : 'Enter your phone number to receive a one-time login code'}
            </Text>

            {/* Step 1: Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number (India)</Text>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(val) => {
                    setPhoneNumber(val);
                    if (otpSent) setOtpSent(false); // Reset step if phone changes
                  }}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Step 2: OTP Input (Visible after requesting OTP) */}
            {otpSent && (
              <View style={styles.inputGroup}>
                <View style={styles.otpLabelRow}>
                  <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
                </View>
                <View style={styles.inputRow}>
                  <Ionicons name="key-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 6-digit code from terminal"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    editable={!isLoading}
                    autoFocus
                  />
                </View>
              </View>
            )}

            {/* Primary Action Button */}
            {!otpSent ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRequestOtp}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send Login OTP</Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.textLight} />
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonStack}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.textLight} />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
                      <Ionicons name="checkmark-circle" size={18} color={colors.textLight} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleRequestOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Server Terminal Instruction Box */}
          <View style={styles.devHintBox}>
            <Ionicons name="terminal-outline" size={18} color={colors.secondary} />
            <Text style={styles.devHintText}>
              The OTP code is printed directly in your backend server terminal. Please read it from your server log and type it above.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  otpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autofillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 52,
    marginTop: 8,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonStack: {
    gap: 8,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  devHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondaryLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  devHintText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  bannerSuccess: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerError: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  bannerSuccessText: {
    color: colors.primaryDark,
  },
  bannerErrorText: {
    color: colors.danger,
  },
});
