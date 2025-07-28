import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, Platform, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePaymentStore } from "@/store/paymentStore";
import { PaymentStatus } from "@/types/payment";
import DetailItem from "@/components/DetailItem";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import ConfirmationModal from "@/components/ConfirmationModal";
import { colors } from "@/constants/colors";
import { 
  DollarSign, 
  Calendar, 
  Building, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Download,
  Edit,
  Trash2,
  History,
  CalendarDays,
  Store,
  Save,
  X
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

const statusIcons: Record<PaymentStatus, any> = {
  unpaid: AlertCircle,
  pending: Clock,
  paid: CheckCircle,
  overpaid: TrendingUp,
};

export default function PaymentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { payments, updatePaymentStatus, updatePayment, deletePayment, getPaymentHistory } = usePaymentStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>("unpaid");
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    advertiserName: "",
    campaignName: "",
    invoiceDate: "",
    dueDate: "",
    paidDate: "",
    contractStartDate: "",
    contractPeriod: "",
    contractStoreCount: "",
    notes: "",
  });
  
  const payment = payments.find((p) => p.id === id);
  const history = getPaymentHistory(id);
  
  // Initialize edit form when payment is loaded
  React.useEffect(() => {
    if (payment && !isEditing) {
      setEditForm({
        advertiserName: payment.advertiserName,
        campaignName: payment.campaignName,
        invoiceDate: payment.invoiceDate,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate || "",
        contractStartDate: payment.contractStartDate,
        contractPeriod: payment.contractPeriod,
        contractStoreCount: payment.contractStoreCount.toString(),
        notes: payment.notes || "",
      });
    }
  }, [payment, isEditing]);
  
  if (!payment) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Button
            title="戻る"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </View>
    );
  }

  const StatusIcon = statusIcons[payment.status];
  const isWeb = Platform.OS === 'web';

  const handleStatusUpdate = (newStatus: PaymentStatus) => {
    updatePaymentStatus(id, newStatus);
    setStatusModalVisible(false);
    Alert.alert("更新完了", "取引ステータスを更新しました");
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    deletePayment(id);
    setDeleteModalVisible(false);
    router.replace("/payments");
  };

  const handleDownloadInvoice = () => {
    if (payment.invoiceUrl) {
      if (Platform.OS === 'web') {
        window.open(payment.invoiceUrl, '_blank');
      } else {
        Alert.alert("請求書", "請求書をダウンロードします");
      }
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (payment) {
      setEditForm({
        advertiserName: payment.advertiserName,
        campaignName: payment.campaignName,
        invoiceDate: payment.invoiceDate,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate || "",
        contractStartDate: payment.contractStartDate,
        contractPeriod: payment.contractPeriod,
        contractStoreCount: payment.contractStoreCount.toString(),
        notes: payment.notes || "",
      });
    }
  };
  
  const handleSaveEdit = () => {
    if (!payment) return;
    
    const updatedPayment = {
      advertiserName: editForm.advertiserName,
      campaignName: editForm.campaignName,
      invoiceDate: editForm.invoiceDate,
      dueDate: editForm.dueDate,
      paidDate: editForm.paidDate || undefined,
      contractStartDate: editForm.contractStartDate,
      contractPeriod: editForm.contractPeriod,
      contractStoreCount: parseInt(editForm.contractStoreCount) || 0,
      notes: editForm.notes || undefined,
    };
    
    updatePayment(id, updatedPayment);
    setIsEditing(false);
    Alert.alert("更新完了", "取引情報を更新しました");
  };

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webHeader}>
          <View style={styles.webHeaderContent}>
            <Text style={styles.webTitle}>取引詳細</Text>
            <View style={styles.webStatusContainer}>
              <View style={[styles.webStatusBadge, { backgroundColor: statusColors[payment.status] }]}>
                <StatusIcon size={16} color={colors.background} />
                <Text style={styles.webStatusText}>{statusLabels[payment.status]}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.webContent}>
          <View style={styles.webMainContent}>
            <View style={styles.webPaymentCard}>
              {!isEditing ? (
                <>
                  <Text style={styles.webPaymentTitle}>{payment.campaignName}</Text>
                  <Text style={styles.webAdvertiserName}>{payment.advertiserName}</Text>
                  
                  <View style={styles.webMetaInfo}>
                    <View style={styles.webMetaItem}>
                      <DollarSign size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>¥{payment.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.webMetaItem}>
                      <Calendar size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>請求日: {payment.invoiceDate}</Text>
                    </View>
                    <View style={styles.webMetaItem}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>支払期限: {payment.dueDate}</Text>
                    </View>
                    {payment.paidDate && (
                      <View style={styles.webMetaItem}>
                        <CheckCircle size={16} color={colors.success} />
                        <Text style={styles.webMetaText}>入金日: {payment.paidDate}</Text>
                      </View>
                    )}
                    <View style={styles.webMetaItem}>
                      <CalendarDays size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>契約開始日: {payment.contractStartDate}</Text>
                    </View>
                    <View style={styles.webMetaItem}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>契約期間: {payment.contractPeriod}</Text>
                    </View>
                    <View style={styles.webMetaItem}>
                      <Store size={16} color={colors.textSecondary} />
                      <Text style={styles.webMetaText}>契約店舗数: {payment.contractStoreCount}店舗</Text>
                    </View>
                  </View>

                  {payment.notes && (
                    <View style={styles.webNotesSection}>
                      <Text style={styles.webNotesLabel}>備考</Text>
                      <Text style={styles.webNotesText}>{payment.notes}</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.webEditForm}>
                  <Text style={styles.webEditTitle}>取引情報を編集</Text>
                  
                  <FormField
                    label="広告主名"
                    value={editForm.advertiserName}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, advertiserName: text }))}
                    placeholder="広告主名を入力"
                  />
                  
                  <FormField
                    label="キャンペーン名"
                    value={editForm.campaignName}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, campaignName: text }))}
                    placeholder="キャンペーン名を入力"
                  />
                  
                  <View style={styles.webFormRow}>
                    <View style={styles.webFormColumn}>
                      <FormField
                        label="請求日"
                        value={editForm.invoiceDate}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, invoiceDate: text }))}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                    <View style={styles.webFormColumn}>
                      <FormField
                        label="支払期限"
                        value={editForm.dueDate}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, dueDate: text }))}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                  </View>
                  
                  <FormField
                    label="入金日"
                    value={editForm.paidDate}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, paidDate: text }))}
                    placeholder="YYYY-MM-DD（未入金の場合は空欄）"
                  />
                  
                  <View style={styles.webFormRow}>
                    <View style={styles.webFormColumn}>
                      <FormField
                        label="契約開始日"
                        value={editForm.contractStartDate}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, contractStartDate: text }))}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                    <View style={styles.webFormColumn}>
                      <FormField
                        label="契約期間"
                        value={editForm.contractPeriod}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, contractPeriod: text }))}
                        placeholder="例: 6ヶ月"
                      />
                    </View>
                  </View>
                  
                  <FormField
                    label="契約店舗数"
                    value={editForm.contractStoreCount}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, contractStoreCount: text }))}
                    placeholder="店舗数を入力"
                    keyboardType="numeric"
                  />
                  
                  <FormField
                    label="備考"
                    value={editForm.notes}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, notes: text }))}
                    placeholder="備考を入力"
                    multiline
                  />
                  
                  <View style={styles.webEditActions}>
                    <Button
                      title="キャンセル"
                      onPress={handleCancelEdit}
                      variant="outline"
                      icon={<X size={16} color={colors.textSecondary} />}
                      style={styles.webEditButton}
                    />
                    <Button
                      title="保存"
                      onPress={handleSaveEdit}
                      variant="primary"
                      icon={<Save size={16} color={colors.background} />}
                      style={styles.webEditButton}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* History Section */}
            {history.length > 0 && (
              <View style={styles.webHistoryCard}>
                <View style={styles.webHistoryHeader}>
                  <History size={20} color={colors.primary} />
                  <Text style={styles.webHistoryTitle}>ステータス履歴</Text>
                </View>
                <View style={styles.webHistoryList}>
                  {history.map((item) => (
                    <View key={item.id} style={styles.webHistoryItem}>
                      <View style={styles.webHistoryMeta}>
                        <Text style={styles.webHistoryDate}>
                          {new Date(item.updatedAt).toLocaleString("ja-JP")}
                        </Text>
                        <Text style={styles.webHistoryUser}>{item.updatedBy}</Text>
                      </View>
                      <Text style={styles.webHistoryChange}>
                        {statusLabels[item.previousStatus]} → {statusLabels[item.newStatus]}
                      </Text>
                      {item.notes && (
                        <Text style={styles.webHistoryNotes}>{item.notes}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.webSidebar}>
            <View style={styles.webActionsCard}>
              <Text style={styles.webActionsTitle}>アクション</Text>
              
              <View style={styles.webActionButtons}>
                {!isEditing ? (
                  <>
                    <Button
                      title="編集"
                      onPress={handleEdit}
                      variant="outline"
                      icon={<Edit size={16} color={colors.primary} />}
                      style={styles.webActionButton}
                    />
                    
                    <Button
                      title="ステータス変更"
                      onPress={() => setStatusModalVisible(true)}
                      variant="primary"
                      style={styles.webActionButton}
                    />
                    
                    {payment.invoiceUrl && (
                      <Button
                        title="請求書ダウンロード"
                        onPress={handleDownloadInvoice}
                        variant="outline"
                        icon={<Download size={16} color={colors.primary} />}
                        style={styles.webActionButton}
                      />
                    )}
                    
                    <Button
                      title="削除"
                      onPress={handleDelete}
                      variant="danger"
                      style={styles.webActionButton}
                    />
                  </>
                ) : (
                  <Text style={styles.webEditingNote}>編集モード中...</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Status Update Modal */}
        <ConfirmationModal
          visible={statusModalVisible}
          title="ステータス変更"
          message="新しいステータスを選択してください"
          onConfirm={() => handleStatusUpdate(selectedStatus)}
          onCancel={() => setStatusModalVisible(false)}
          confirmText="更新"
          cancelText="キャンセル"
        />

        <ConfirmationModal
          visible={deleteModalVisible}
          title="支払い記録を削除"
          message="この支払い記録を削除してもよろしいですか？この操作は元に戻せません。"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          confirmText="削除"
          cancelText="キャンセル"
        />
      </View>
    );
  }

  // Mobile Layout
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[payment.status] }]}>
              <StatusIcon size={14} color={colors.background} />
              <Text style={styles.statusText}>{statusLabels[payment.status]}</Text>
            </View>
          </View>
          
          <Text style={styles.campaignName}>{payment.campaignName}</Text>
          <Text style={styles.advertiserName}>{payment.advertiserName}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          {!isEditing ? (
            <>
              <DetailItem label="金額" value={payment.amount} type="money" />
              <DetailItem label="請求日" value={payment.invoiceDate} />
              <DetailItem label="支払期限" value={payment.dueDate} />
              {payment.paidDate && (
                <DetailItem label="入金日" value={payment.paidDate} />
              )}
              <DetailItem label="契約開始日" value={payment.contractStartDate} />
              <DetailItem label="契約期間" value={payment.contractPeriod} />
              <DetailItem label="契約店舗数" value={`${payment.contractStoreCount}店舗`} />
              {payment.notes && (
                <DetailItem label="備考" value={payment.notes} />
              )}
            </>
          ) : (
            <View style={styles.mobileEditForm}>
              <Text style={styles.mobileEditTitle}>支払い情報を編集</Text>
              
              <FormField
                label="広告主名"
                value={editForm.advertiserName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, advertiserName: text }))}
                placeholder="広告主名を入力"
              />
              
              <FormField
                label="キャンペーン名"
                value={editForm.campaignName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, campaignName: text }))}
                placeholder="キャンペーン名を入力"
              />
              
              <FormField
                label="請求日"
                value={editForm.invoiceDate}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, invoiceDate: text }))}
                placeholder="YYYY-MM-DD"
              />
              
              <FormField
                label="支払期限"
                value={editForm.dueDate}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, dueDate: text }))}
                placeholder="YYYY-MM-DD"
              />
              
              <FormField
                label="入金日"
                value={editForm.paidDate}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, paidDate: text }))}
                placeholder="YYYY-MM-DD（未入金の場合は空欄）"
              />
              
              <FormField
                label="契約開始日"
                value={editForm.contractStartDate}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, contractStartDate: text }))}
                placeholder="YYYY-MM-DD"
              />
              
              <FormField
                label="契約期間"
                value={editForm.contractPeriod}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, contractPeriod: text }))}
                placeholder="例: 6ヶ月"
              />
              
              <FormField
                label="契約店舗数"
                value={editForm.contractStoreCount}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, contractStoreCount: text }))}
                placeholder="店舗数を入力"
                keyboardType="numeric"
              />
              
              <FormField
                label="備考"
                value={editForm.notes}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, notes: text }))}
                placeholder="備考を入力"
                multiline
              />
            </View>
          )}
        </View>

        {/* History */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>ステータス履歴</Text>
            {history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {new Date(item.updatedAt).toLocaleString("ja-JP")}
                  </Text>
                  <Text style={styles.historyUser}>{item.updatedBy}</Text>
                </View>
                <Text style={styles.historyChange}>
                  {statusLabels[item.previousStatus]} → {statusLabels[item.newStatus]}
                </Text>
                {item.notes && (
                  <Text style={styles.historyNotes}>{item.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {!isEditing ? (
          <>
            <Button
              title="編集"
              onPress={handleEdit}
              variant="outline"
              style={styles.button}
            />
            
            <Button
              title="ステータス変更"
              onPress={() => setStatusModalVisible(true)}
              variant="primary"
              style={styles.button}
            />
            
            {payment.invoiceUrl && (
              <Button
                title="請求書"
                onPress={handleDownloadInvoice}
                variant="outline"
                style={styles.button}
              />
            )}
            
            <Button
              title="削除"
              onPress={handleDelete}
              variant="danger"
              style={styles.button}
            />
          </>
        ) : (
          <>
            <Button
              title="キャンセル"
              onPress={handleCancelEdit}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="保存"
              onPress={handleSaveEdit}
              variant="primary"
              style={styles.button}
            />
          </>
        )}
      </View>

      {/* Status Update Modal */}
      <ConfirmationModal
        visible={statusModalVisible}
        title="ステータス変更"
        message="新しいステータスを選択してください"
        onConfirm={() => handleStatusUpdate(selectedStatus)}
        onCancel={() => setStatusModalVisible(false)}
        confirmText="更新"
        cancelText="キャンセル"
      />
      
      <ConfirmationModal
        visible={deleteModalVisible}
        title="支払い記録を削除"
        message="この支払い記録を削除してもよろしいですか？この操作は元に戻せません。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="削除"
        cancelText="キャンセル"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.background,
  },
  campaignName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  advertiserName: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailsContainer: {
    padding: 16,
  },
  historySection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyUser: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyChange: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: 100,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
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
  webHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
  },
  webStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  webStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  webStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.background,
  },
  webContent: {
    flex: 1,
    flexDirection: "row",
    padding: 32,
    gap: 32,
  },
  webMainContent: {
    flex: 2,
    gap: 24,
  },
  webPaymentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webPaymentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  webAdvertiserName: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  webMetaInfo: {
    gap: 12,
    marginBottom: 24,
  },
  webMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webMetaText: {
    fontSize: 16,
    color: colors.text,
  },
  webNotesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  webNotesLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  webNotesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  webHistoryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webHistoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  webHistoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  webHistoryList: {
    gap: 16,
  },
  webHistoryItem: {
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webHistoryMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  webHistoryDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  webHistoryUser: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  webHistoryChange: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  webHistoryNotes: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  webSidebar: {
    flex: 1,
  },
  webActionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 20,
  },
  webActionButtons: {
    gap: 12,
  },
  webActionButton: {
    width: "100%",
  },
  webEditForm: {
    gap: 16,
  },
  webEditTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 20,
  },
  webFormRow: {
    flexDirection: "row",
    gap: 16,
  },
  webFormColumn: {
    flex: 1,
  },
  webEditActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  webEditButton: {
    flex: 1,
  },
  webEditingNote: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  mobileEditForm: {
    gap: 16,
  },
  mobileEditTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
});