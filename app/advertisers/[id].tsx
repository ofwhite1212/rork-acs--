import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAdvertiserStore } from "@/store/advertiserStore";
import { usePaymentStore } from "@/store/paymentStore";
import DetailItem from "@/components/DetailItem";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { colors } from "@/constants/colors";
import { CreditCard, ArrowRight } from "lucide-react-native";

export default function AdvertiserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { advertisers, deleteAdvertiser } = useAdvertiserStore();
  const { payments } = usePaymentStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const advertiser = advertisers.find((adv) => adv.id === id);
  const advertiserPayments = payments.filter((payment) => payment.advertiserId === id);
  
  if (!advertiser) {
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
  
  const handleEdit = () => {
    router.push(`/advertisers/edit/${id}`);
  };
  
  const handleDelete = () => {
    setDeleteModalVisible(true);
  };
  
  const confirmDelete = () => {
    deleteAdvertiser(id);
    setDeleteModalVisible(false);
    router.replace("/advertisers");
  };
  
  const handlePaymentPress = (paymentId: string) => {
    router.push(`/payments/${paymentId}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return colors.success;
      case "unpaid":
        return colors.error;
      case "pending":
        return colors.warning;
      case "overpaid":
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "入金済み";
      case "unpaid":
        return "未払い";
      case "pending":
        return "確認中";
      case "overpaid":
        return "過払い";
      default:
        return status;
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <DetailItem label="会社名" value={advertiser.name} />
          <DetailItem label="広告内容" value={advertiser.adContent} />
          <DetailItem label="希望エリア" value={advertiser.preferredArea.join("、")} />
          <DetailItem label="期間" value={advertiser.period} />
          <DetailItem label="予算" value={advertiser.budget} type="money" />
          <DetailItem label="担当者" value={advertiser.contactPerson} />
          <DetailItem label="連絡先" value={advertiser.contactInfo} />
          <DetailItem label="登録日" value={advertiser.createdAt} />
        </View>
        
        {/* 支払い情報セクション */}
        <View style={styles.paymentsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <CreditCard size={20} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>支払い情報</Text>
          </View>
          
          {advertiserPayments.length > 0 ? (
            <View style={styles.paymentsList}>
              {advertiserPayments.map((payment, index) => (
                <TouchableOpacity
                  key={payment.id}
                  style={[styles.paymentItem, index > 0 && styles.paymentItemMargin]}
                  onPress={() => handlePaymentPress(payment.id)}
                >
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentCampaign}>{payment.campaignName}</Text>
                    <Text style={styles.paymentAmount}>¥{payment.amount.toLocaleString()}</Text>
                    <View style={styles.paymentMeta}>
                      <Text style={styles.paymentDate}>請求日: {payment.invoiceDate}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(payment.status)}</Text>
                      </View>
                    </View>
                  </View>
                  <ArrowRight size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noPayments}>
              <Text style={styles.noPaymentsText}>支払い情報がありません</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="編集"
          onPress={handleEdit}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="削除"
          onPress={handleDelete}
          variant="danger"
          style={styles.button}
        />
      </View>
      
      <ConfirmationModal
        visible={deleteModalVisible}
        title="広告主を削除"
        message="この広告主を削除してもよろしいですか？この操作は元に戻せません。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="削除"
        cancelText="キャンセル"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  paymentsSection: {
    margin: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  paymentsList: {
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCampaign: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  paymentMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.background,
  },
  noPayments: {
    padding: 24,
    alignItems: "center",
  },
  noPaymentsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  paymentItemMargin: {
    marginTop: 12,
  },
});