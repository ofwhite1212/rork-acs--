import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { usePaymentStore } from "@/store/paymentStore";
import { PaymentStatus } from "@/types/payment";
import SearchBar from "@/components/SearchBar";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download, 
  Upload, 
  RefreshCw,
  Filter,
  Calendar,
  Building,
  FileText,
  BarChart3
} from "lucide-react-native";

const statusLabels: Record<PaymentStatus, string> = {
  unpaid: "未払い",
  pending: "確認中",
  paid: "入金済み",
  overpaid: "過払い",
};

const statusColors: Record<PaymentStatus, string> = {
  unpaid: colors.error,
  pending: colors.warning,
  paid: colors.success,
  overpaid: colors.secondary,
};

const statusIcons: Record<PaymentStatus, React.ComponentType<any>> = {
  unpaid: AlertCircle,
  pending: Clock,
  paid: CheckCircle,
  overpaid: TrendingUp,
};

export default function PaymentsScreen() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    advertiserFilter,
    setAdvertiserFilter,
    dateRangeStart,
    dateRangeEnd,
    setDateRange,
    filteredPayments,
    getPaymentSummary,
    updatePaymentStatus,
    exportToCSV,
    syncWithSupabase,
  } = usePaymentStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const payments = filteredPayments();
  const summary = getPaymentSummary();
  const isWeb = Platform.OS === 'web';

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = exportToCSV();
      
      if (Platform.OS === 'web') {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Alert.alert("エクスポート完了", "CSVファイルが生成されました");
      }
    } catch (error) {
      Alert.alert("エラー", "CSVエクスポートに失敗しました");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncWithSupabase();
      Alert.alert("同期完了", "Supabaseとの同期が完了しました");
    } catch (error) {
      Alert.alert("エラー", "同期に失敗しました");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStatusUpdate = (paymentId: string, newStatus: PaymentStatus) => {
    updatePaymentStatus(paymentId, newStatus);
    Alert.alert("更新完了", "支払いステータスを更新しました");
  };

  const navigateToDetail = (id: string) => {
    router.push(`/payments/${id}`);
  };

  if (isWeb) {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>取引管理</Text>
          <Text style={styles.subtitle}>請求・入金状況の管理</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.webSummaryContainer}>
          <View style={styles.webSummaryCard}>
            <View style={styles.summaryIconContainer}>
              <DollarSign size={28} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>¥{summary.totalInvoiced.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>請求総額</Text>
            </View>
          </View>

          <View style={styles.webSummaryCard}>
            <View style={styles.summaryIconContainer}>
              <CheckCircle size={28} color={colors.success} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>¥{summary.totalPaid.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>入金済み</Text>
            </View>
          </View>

          <View style={styles.webSummaryCard}>
            <View style={styles.summaryIconContainer}>
              <AlertCircle size={28} color={colors.error} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>¥{summary.totalUnpaid.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>未払い</Text>
            </View>
          </View>

          <View style={styles.webSummaryCard}>
            <View style={styles.summaryIconContainer}>
              <BarChart3 size={28} color={colors.secondary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>{summary.paymentRate.toFixed(1)}%</Text>
              <Text style={styles.summaryLabel}>支払い率</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.webFiltersContainer}>
          <View style={styles.webSearchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="広告主名、掲載広告で検索..."
            />
          </View>

          <View style={styles.webFiltersSection}>
            <View style={styles.webFilterRow}>
              <View style={styles.webFilterGroup}>
                <Text style={styles.webFilterLabel}>ステータス:</Text>
                <View style={styles.webFilterButtons}>
                  {[
                    { key: "all", label: "すべて" },
                    { key: "unpaid", label: "未払い" },
                    { key: "pending", label: "確認中" },
                    { key: "paid", label: "入金済み" },
                    { key: "overpaid", label: "過払い" }
                  ].map((status) => (
                    <TouchableOpacity
                      key={status.key}
                      style={[styles.webFilterButton, statusFilter === status.key && styles.webFilterButtonActive]}
                      onPress={() => setStatusFilter(status.key as any)}
                    >
                      <Text style={[styles.webFilterButtonText, statusFilter === status.key && styles.webFilterButtonTextActive]}>
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.webFilterRow}>
              <View style={styles.webFilterInputGroup}>
                <FormField
                  label="広告主名"
                  value={advertiserFilter}
                  onChangeText={setAdvertiserFilter}
                  placeholder="株式会社..."
                />
              </View>
              <View style={styles.webFilterInputGroup}>
                <FormField
                  label="開始日"
                  value={dateRangeStart}
                  onChangeText={(value) => setDateRange(value, dateRangeEnd)}
                  placeholder="2025-01-01"
                />
              </View>
              <View style={styles.webFilterInputGroup}>
                <FormField
                  label="終了日"
                  value={dateRangeEnd}
                  onChangeText={(value) => setDateRange(dateRangeStart, value)}
                  placeholder="2025-12-31"
                />
              </View>
            </View>
          </View>

          <View style={styles.webActionsContainer}>
            <Button
              title="CSVエクスポート"
              onPress={handleExportCSV}
              variant="outline"
              loading={isExporting}
              icon={<Download size={16} color={colors.primary} />}
              style={styles.webActionButton}
            />
            <Button
              title="Supabase同期"
              onPress={handleSync}
              variant="secondary"
              loading={isSyncing}
              icon={<RefreshCw size={16} color={colors.background} />}
              style={styles.webActionButton}
            />
          </View>
        </View>

        {/* Payments Table */}
        <View style={styles.webTableContainer}>
          <Text style={styles.webSectionTitle}>
            取引一覧 ({payments.length}件)
          </Text>

          <View style={styles.webTable}>
            <View style={styles.webTableHeader}>
              <Text style={[styles.webTableHeaderText, styles.webTableColAdvertiser]}>広告主名</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColCampaign]}>掲載広告</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColAmount]}>金額</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColStatus]}>ステータス</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColDate]}>請求日</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColDate]}>支払期限</Text>
              <Text style={[styles.webTableHeaderText, styles.webTableColActions]}>アクション</Text>
            </View>

            {payments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>支払い記録がありません</Text>
              </View>
            ) : (
              payments.map((payment) => {
                const StatusIcon = statusIcons[payment.status];
                return (
                  <TouchableOpacity
                    key={payment.id}
                    style={styles.webTableRow}
                    onPress={() => navigateToDetail(payment.id)}
                  >
                    <Text style={[styles.webTableCellText, styles.webTableColAdvertiser]} numberOfLines={1}>
                      {payment.advertiserName}
                    </Text>
                    <Text style={[styles.webTableCellText, styles.webTableColCampaign]} numberOfLines={1}>
                      {payment.campaignName}
                    </Text>
                    <Text style={[styles.webTableCellText, styles.webTableColAmount]}>
                      ¥{payment.amount.toLocaleString()}
                    </Text>
                    <View style={[styles.webTableColStatus, styles.statusContainer]}>
                      <View style={[styles.statusBadge, { backgroundColor: statusColors[payment.status] }]}>
                        <StatusIcon size={12} color={colors.background} />
                        <Text style={styles.statusText}>{statusLabels[payment.status]}</Text>
                      </View>
                    </View>
                    <Text style={[styles.webTableCellText, styles.webTableColDate]}>
                      {payment.invoiceDate}
                    </Text>
                    <Text style={[styles.webTableCellText, styles.webTableColDate]}>
                      {payment.dueDate}
                    </Text>
                    <View style={[styles.webTableColActions, styles.actionsContainer]}>
                      {payment.invoiceUrl && (
                        <TouchableOpacity style={styles.actionButton}>
                          <Download size={14} color={colors.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="広告主名、掲載広告で検索..."
      />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <DollarSign size={20} color={colors.primary} />
          <Text style={styles.summaryValue}>¥{summary.totalInvoiced.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>請求総額</Text>
        </View>
        <View style={styles.summaryCard}>
          <CheckCircle size={20} color={colors.success} />
          <Text style={styles.summaryValue}>¥{summary.totalPaid.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>入金済み</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <AlertCircle size={20} color={colors.error} />
          <Text style={styles.summaryValue}>¥{summary.totalUnpaid.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>未払い</Text>
        </View>
        <View style={styles.summaryCard}>
          <BarChart3 size={20} color={colors.secondary} />
          <Text style={styles.summaryValue}>{summary.paymentRate.toFixed(1)}%</Text>
          <Text style={styles.summaryLabel}>支払い率</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} color={colors.primary} />
          <Text style={styles.filterToggleText}>フィルター</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <Button
            title="CSV"
            onPress={handleExportCSV}
            variant="outline"
            loading={isExporting}
            style={styles.smallButton}
          />
          <Button
            title="同期"
            onPress={handleSync}
            variant="secondary"
            loading={isSyncing}
            style={styles.smallButton}
          />
        </View>
      </View>

      {showFilters && (
        <View style={styles.filterOptions}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>ステータス:</Text>
            <View style={styles.filterButtons}>
              {[
                { key: "all", label: "すべて" },
                { key: "unpaid", label: "未払い" },
                { key: "pending", label: "確認中" },
                { key: "paid", label: "入金済み" },
                { key: "overpaid", label: "過払い" }
              ].map((status) => (
                <TouchableOpacity
                  key={status.key}
                  style={[
                    styles.filterButton,
                    statusFilter === status.key && styles.filterButtonActive
                  ]}
                  onPress={() => setStatusFilter(status.key as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    statusFilter === status.key && styles.filterButtonTextActive
                  ]}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Payments List */}
      <ScrollView style={styles.paymentsList}>
        {payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>支払い記録がありません</Text>
          </View>
        ) : (
          payments.map((payment) => {
            const StatusIcon = statusIcons[payment.status];
            return (
              <TouchableOpacity
                key={payment.id}
                style={styles.paymentItem}
                onPress={() => navigateToDetail(payment.id)}
              >
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentAdvertiser} numberOfLines={1}>
                    {payment.advertiserName}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors[payment.status] }]}>
                    <StatusIcon size={10} color={colors.background} />
                    <Text style={styles.statusText}>{statusLabels[payment.status]}</Text>
                  </View>
                </View>
                <View style={styles.advertisementContainer}>
                  <Text style={styles.advertisementLabel}>掲載広告:</Text>
                  <Text style={styles.paymentCampaign} numberOfLines={1}>
                    {payment.campaignName}
                  </Text>
                </View>
                <View style={styles.paymentMeta}>
                  <Text style={styles.paymentAmount}>¥{payment.amount.toLocaleString()}</Text>
                  <Text style={styles.paymentDate}>{payment.invoiceDate}</Text>
                </View>

              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterToggleText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    paddingHorizontal: 12,
    minWidth: 60,
  },
  filterOptions: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.background,
    fontWeight: "500",
  },
  paymentsList: {
    flex: 1,
  },
  paymentItem: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentAdvertiser: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.background,
  },
  advertisementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  advertisementLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 8,
  },
  paymentCampaign: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  paymentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  paymentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },

  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webHeader: {
    padding: 32,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  webSummaryContainer: {
    flexDirection: "row",
    padding: 32,
    gap: 24,
  },
  webSummaryCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryIconContainer: {
    marginRight: 16,
  },
  summaryContent: {
    flex: 1,
  },
  webFiltersContainer: {
    padding: 32,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webSearchContainer: {
    marginBottom: 24,
  },
  webFiltersSection: {
    gap: 20,
  },
  webFilterRow: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-end",
  },
  webFilterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  webFilterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    minWidth: 80,
  },
  webFilterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  webFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webFilterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  webFilterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  webFilterButtonTextActive: {
    color: colors.background,
    fontWeight: "600",
  },
  webFilterInputGroup: {
    flex: 1,
    minWidth: 150,
  },
  webActionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  webActionButton: {
    minWidth: 150,
  },
  webTableContainer: {
    padding: 32,
  },
  webSectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 24,
  },
  webTable: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  webTableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webTableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  webTableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
  },
  webTableCellText: {
    fontSize: 14,
    color: colors.text,
  },
  webTableColAdvertiser: {
    flex: 2,
    marginRight: 12,
  },

  webTableColCampaign: {
    flex: 2,
    marginRight: 12,
  },
  webTableColAmount: {
    flex: 1,
    marginRight: 12,
    textAlign: "right",
  },
  webTableColStatus: {
    flex: 1,
    marginRight: 12,
    alignItems: "center",
  },
  webTableColDate: {
    flex: 1,
    marginRight: 12,
  },
  webTableColActions: {
    flex: 0.8,
    alignItems: "center",
  },
  statusContainer: {
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
  },
});