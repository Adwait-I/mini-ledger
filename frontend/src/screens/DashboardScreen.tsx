import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLoans } from '../hooks/useLoans';
import { useSummary } from '../hooks/useSummary';
import { SummaryCard } from '../components/SummaryCard';
import { LoanCard } from '../components/LoanCard';
import { AddLoanModal } from '../components/AddLoanModal';
import { colors } from '../theme/colors';
import { CreateLoanPayload, LoanEntry } from '../types';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'ALL' | 'PENDING' | 'OVERDUE' | 'REPAID';

export const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    loans,
    isLoading: isLoadingLoans,
    isRefetching: isRefetchingLoans,
    refetch: refetchLoans,
    createLoan,
    isCreating,
    repayLoan,
  } = useLoans();

  const {
    summary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useSummary();

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [modalVisible, setModalVisible] = useState(false);
  const [repayingId, setRepayingId] = useState<string | null>(null);

  // Filter loans based on active chip
  const filteredLoans = useMemo(() => {
    switch (activeFilter) {
      case 'PENDING':
        return loans.filter((l) => l.status === 'PENDING');
      case 'OVERDUE':
        return loans.filter((l) => l.status === 'PENDING' && l.isOverdue);
      case 'REPAID':
        return loans.filter((l) => l.status === 'REPAID');
      case 'ALL':
      default:
        return loans;
    }
  }, [loans, activeFilter]);

  const onRefresh = async () => {
    await Promise.all([refetchLoans(), refetchSummary()]);
  };

  const handleMarkRepaid = async (id: string) => {
    const doRepay = async () => {
      try {
        setRepayingId(id);
        await repayLoan(id);
      } catch (err: any) {
        console.error('Error marking loan repaid:', err);
        const errorMsg =
          err?.response?.data?.details?.[0]?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to update loan';
        if (Platform.OS === 'web') {
          window.alert(errorMsg);
        } else {
          Alert.alert('Error', errorMsg);
        }
      } finally {
        setRepayingId(null);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Confirm Repayment: Has this friend repaid the borrowed amount in full?'
      );
      if (confirmed) {
        await doRepay();
      }
    } else {
      Alert.alert(
        'Confirm Repayment',
        'Has this friend repaid the borrowed amount in full?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm Repaid',
            style: 'default',
            onPress: doRepay,
          },
        ]
      );
    }
  };

  const handleCreateLoan = async (data: CreateLoanPayload) => {
    await createLoan(data);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out of MiniLedger?')) {
        logout();
      }
      return;
    }

    Alert.alert('Sign Out', 'Are you sure you want to log out of MiniLedger?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const renderHeader = () => (
    <View>
      {/* Top Summary Card */}
      <SummaryCard summary={summary} isLoading={isLoadingSummary} />

      {/* List Header & Filters */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Loan Records</Text>
          <Text style={styles.recordCount}>({filteredLoans.length})</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterBar}>
          {(['ALL', 'PENDING', 'OVERDUE', 'REPAID'] as FilterType[]).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                  filter === 'OVERDUE' && isActive && styles.filterPillOverdueActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                    filter === 'OVERDUE' && isActive && styles.filterTextOverdueActive,
                  ]}
                >
                  {filter === 'ALL'
                    ? 'All'
                    : filter === 'PENDING'
                    ? 'Pending'
                    : filter === 'OVERDUE'
                    ? 'Overdue'
                    : 'Repaid'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => {
    if (isLoadingLoans) return null;

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No loans found</Text>
        <Text style={styles.emptySubtitle}>
          {activeFilter === 'ALL'
            ? 'You have not recorded any loans yet. Tap the button below to add your first loan!'
            : `No ${activeFilter.toLowerCase()} loans match the selected filter.`}
        </Text>
        {activeFilter === 'ALL' && (
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={18} color={colors.textLight} />
            <Text style={styles.emptyActionButtonText}>Record First Loan</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.userProfile}>
          <View style={styles.avatarMini}>
            <Ionicons name="person" size={16} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.phoneBadge}>{user?.phoneNumber || 'User'}</Text>
          </View>
        </View>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.addLoanHeaderBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color={colors.textLight} />
            <Text style={styles.addLoanHeaderBtnText}>New Loan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Loan List */}
      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LoanCard
            loan={item}
            onMarkRepaid={handleMarkRepaid}
            isRepaying={repayingId === item.id}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingLoans}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* Add Loan Modal */}
      <AddLoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateLoan}
        isSubmitting={isCreating}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  phoneBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addLoanHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  addLoanHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textLight,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  recordCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillOverdueActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.textLight,
  },
  filterTextOverdueActive: {
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 260,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  emptyActionButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
});
