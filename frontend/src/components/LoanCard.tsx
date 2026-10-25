import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LoanEntry } from '../types';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface LoanCardProps {
  loan: LoanEntry;
  onMarkRepaid: (id: string) => Promise<void>;
  isRepaying?: boolean;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  onMarkRepaid,
  isRepaying = false,
}) => {
  const isPending = loan.status === 'PENDING';
  const isOverdue = !!loan.isOverdue && isPending;

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View
      style={[
        styles.card,
        isOverdue && styles.cardOverdue,
        loan.status === 'REPAID' && styles.cardRepaid,
      ]}
    >
      {/* Top Row: Friend & Status Badges */}
      <View style={styles.topRow}>
        <View style={styles.friendInfo}>
          <View
            style={[
              styles.avatar,
              isOverdue
                ? styles.avatarOverdue
                : loan.status === 'REPAID'
                ? styles.avatarRepaid
                : styles.avatarPending,
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                isOverdue
                  ? styles.avatarTextOverdue
                  : loan.status === 'REPAID'
                  ? styles.avatarTextRepaid
                  : styles.avatarTextPending,
              ]}
            >
              {loan.friendName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.friendName}>{loan.friendName}</Text>
            <Text style={styles.createdDate}>
              Lent on {formatDate(loan.createdAt)}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.badgeContainer}>
          {loan.status === 'REPAID' ? (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Ionicons name="checkmark-done" size={13} color={colors.primaryDark} />
              <Text style={styles.badgeSuccessText}>Repaid</Text>
            </View>
          ) : isOverdue ? (
            <View style={[styles.badge, styles.badgeOverdue]}>
              <Ionicons name="alert-circle" size={13} color={colors.danger} />
              <Text style={styles.badgeOverdueText}>OVERDUE</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgePending]}>
              <Ionicons name="time-outline" size={13} color={colors.warning} />
              <Text style={styles.badgePendingText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      {/* Middle Row: Amount & Due Date */}
      <View style={styles.middleRow}>
        <View>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text
            style={[
              styles.amountValue,
              isOverdue && styles.amountValueOverdue,
              loan.status === 'REPAID' && styles.amountValueRepaid,
            ]}
          >
            {formatCurrency(loan.amount)}
          </Text>
        </View>

        <View style={styles.dueDateBox}>
          <Text style={styles.dueDateLabel}>Due Date</Text>
          <View style={styles.dueDateValueRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={isOverdue ? colors.danger : colors.textSecondary}
            />
            <Text
              style={[
                styles.dueDateValue,
                isOverdue && styles.dueDateValueOverdue,
              ]}
            >
              {formatDate(loan.dueDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Optional Receipt Preview */}
      {loan.receiptUrl ? (
        <View style={styles.receiptContainer}>
          <Ionicons name="image-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.receiptLabel}>Receipt attached:</Text>
          <Image
            source={{ uri: loan.receiptUrl }}
            style={styles.receiptThumbnail}
            resizeMode="cover"
          />
        </View>
      ) : null}

      {/* Bottom Action: Mark Repaid Button (Only for Pending loans) */}
      {isPending && (
        <TouchableOpacity
          style={styles.repayButton}
          onPress={() => onMarkRepaid(loan.id)}
          disabled={isRepaying}
          activeOpacity={0.8}
        >
          {isRepaying ? (
            <ActivityIndicator size="small" color={colors.textLight} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.textLight} />
              <Text style={styles.repayButtonText}>Mark as Repaid</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardOverdue: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  cardRepaid: {
    borderColor: colors.border,
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPending: {
    backgroundColor: colors.surfaceSubtle,
  },
  avatarOverdue: {
    backgroundColor: colors.dangerLight,
  },
  avatarRepaid: {
    backgroundColor: colors.primaryLight,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  avatarTextPending: {
    color: colors.textPrimary,
  },
  avatarTextOverdue: {
    color: colors.danger,
  },
  avatarTextRepaid: {
    color: colors.primaryDark,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createdDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
  },
  badgeSuccess: {
    backgroundColor: colors.primaryLight,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  badgeOverdue: {
    backgroundColor: colors.dangerLight,
  },
  badgeOverdueText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.5,
  },
  badgePending: {
    backgroundColor: colors.warningLight,
  },
  badgePendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  amountValueOverdue: {
    color: colors.danger,
  },
  amountValueRepaid: {
    color: colors.primaryDark,
  },
  dueDateBox: {
    alignItems: 'flex-end',
  },
  dueDateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dueDateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dueDateValueOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  receiptLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  receiptThumbnail: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  repayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
    gap: 6,
  },
  repayButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
});
