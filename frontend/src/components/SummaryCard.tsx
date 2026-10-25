import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { SummaryMetrics } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  summary: SummaryMetrics;
  isLoading?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, isLoading }) => {
  const formatCurrency = (val: number) => {
    return `₹${Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet-outline" size={20} color={colors.primary} />
        </View>
        <Text style={styles.cardTitle}>Portfolio Summary</Text>
        {isLoading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}
      </View>

      {/* Main Total Lent Section */}
      <View style={styles.mainTotalSection}>
        <Text style={styles.mainTotalLabel}>Total Amount Lent</Text>
        <Text style={styles.mainTotalValue}>{formatCurrency(summary.total_lent)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Sub-Metrics Row */}
      <View style={styles.statsRow}>
        {/* Total Repaid */}
        <View style={[styles.statBox, styles.statBoxRepaid]}>
          <View style={styles.statHeader}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primaryDark} />
            <Text style={styles.statLabelRepaid}>Repaid</Text>
          </View>
          <Text style={styles.statValueRepaid}>{formatCurrency(summary.total_repaid)}</Text>
        </View>

        {/* Overdue Amount */}
        <View
          style={[
            styles.statBox,
            summary.overdue_amount > 0 ? styles.statBoxOverdueAlert : styles.statBoxOverdueNeutral,
          ]}
        >
          <View style={styles.statHeader}>
            <Ionicons
              name={summary.overdue_amount > 0 ? 'alert-circle' : 'shield-checkmark-outline'}
              size={16}
              color={summary.overdue_amount > 0 ? colors.danger : colors.textSecondary}
            />
            <Text
              style={
                summary.overdue_amount > 0 ? styles.statLabelOverdue : styles.statLabelNeutral
              }
            >
              Overdue
            </Text>
          </View>
          <Text
            style={
              summary.overdue_amount > 0 ? styles.statValueOverdue : styles.statValueNeutral
            }
          >
            {formatCurrency(summary.overdue_amount)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loader: {
    marginLeft: 'auto',
  },
  mainTotalSection: {
    marginVertical: 4,
  },
  mainTotalLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mainTotalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
  },
  statBoxRepaid: {
    backgroundColor: colors.primaryLight,
  },
  statBoxOverdueAlert: {
    backgroundColor: colors.dangerLight,
  },
  statBoxOverdueNeutral: {
    backgroundColor: colors.surfaceSubtle,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabelRepaid: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  statValueRepaid: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statLabelOverdue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  statValueOverdue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
  statLabelNeutral: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statValueNeutral: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
