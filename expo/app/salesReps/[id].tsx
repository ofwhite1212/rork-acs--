import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSalesRepStore } from "@/store/salesRepStore";
import { useAdvertiserStore } from "@/store/advertiserStore";
import { useAdLocationStore } from "@/store/adLocationStore";
import { useInquiryStore } from "@/store/inquiryStore";
import DetailItem from "@/components/DetailItem";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { colors } from "@/constants/colors";

export default function SalesRepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { salesReps, deleteSalesRep } = useSalesRepStore();
  const { advertisers } = useAdvertiserStore();
  const { adLocations } = useAdLocationStore();
  const { inquiries } = useInquiryStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const salesRep = salesReps.find((rep) => rep.id === id);
  
  if (!salesRep) {
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
    router.push(`/salesReps/edit/${id}`);
  };
  
  const handleDelete = () => {
    setDeleteModalVisible(true);
  };
  
  const confirmDelete = () => {
    deleteSalesRep(id);
    setDeleteModalVisible(false);
    router.replace("/salesReps");
  };

  const contractedAdvertisersList = salesRep.contractedAdvertisers
    .map(advertiserId => advertisers.find(ad => ad.id === advertiserId))
    .filter((advertiser): advertiser is NonNullable<typeof advertiser> => advertiser !== undefined);

  const contractedLocationsList = salesRep.contractedAdLocations
    .map(locationId => adLocations.find(loc => loc.id === locationId))
    .filter((location): location is NonNullable<typeof location> => location !== undefined);

  const handleAdvertiserPress = (advertiserId: string) => {
    router.push(`/advertisers/${advertiserId}`);
  };

  const handleLocationPress = (locationId: string) => {
    router.push(`/adLocations/${locationId}`);
  };

  const pendingInquiries = inquiries.filter(
    inquiry => inquiry.salesRepId === id && inquiry.status === "pending"
  );

  const handleInquiryPress = (inquiryId: string) => {
    router.push(`/inquiries/${inquiryId}`);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <DetailItem label="名前" value={salesRep.name} />
          <DetailItem label="連絡先" value={salesRep.contact} />
          <DetailItem label="活動エリア" value={salesRep.area} />
          <DetailItem label="売上合計" value={`¥${salesRep.salesTotal.toLocaleString()}`} />
          <DetailItem label="インセンティブ" value={`¥${salesRep.incentiveAmount.toLocaleString()}`} />
          <DetailItem label="備考" value={salesRep.notes} />
          <DetailItem label="登録日" value={salesRep.createdAt} />
          
          {/* 契約した広告主 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>契約した広告主</Text>
            {contractedAdvertisersList.length > 0 ? (
              contractedAdvertisersList.map((advertiser) => {
                if (!advertiser) return null;
                return (
                  <TouchableOpacity
                    key={advertiser.id}
                    style={styles.listItem}
                    onPress={() => handleAdvertiserPress(advertiser.id)}
                  >
                    <Text style={styles.listItemText}>{advertiser.name}</Text>
                    <Text style={styles.listItemSubtext}>{advertiser.adContent}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyText}>契約した広告主はありません</Text>
            )}
          </View>
          
          {/* 契約した設置店舗 */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>契約した設置店舗</Text>
            {contractedLocationsList.length > 0 ? (
              contractedLocationsList.map((location) => {
                if (!location) return null;
                return (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.listItem}
                    onPress={() => handleLocationPress(location.id)}
                  >
                    <Text style={styles.listItemText}>{location.name}</Text>
                    <Text style={styles.listItemSubtext}>{location.address}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyText}>契約した設置店舗はありません</Text>
            )}
          </View>
          
          {/* 申請中の問い合わせ */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>申請中の問い合わせ</Text>
            {pendingInquiries.length > 0 ? (
              pendingInquiries.map((inquiry) => (
                <TouchableOpacity
                  key={inquiry.id}
                  style={[styles.listItem, styles.pendingItem]}
                  onPress={() => handleInquiryPress(inquiry.id)}
                >
                  <View style={styles.inquiryHeader}>
                    <Text style={styles.listItemText}>{inquiry.subject}</Text>
                    <View style={[styles.priorityBadge, styles[`priority${inquiry.priority.charAt(0).toUpperCase() + inquiry.priority.slice(1)}` as keyof typeof styles]]}>
                      <Text style={styles.priorityText}>{inquiry.priority === 'high' ? '高' : inquiry.priority === 'medium' ? '中' : '低'}</Text>
                    </View>
                  </View>
                  <Text style={styles.listItemSubtext} numberOfLines={2}>{inquiry.content}</Text>
                  <Text style={styles.dateText}>{inquiry.createdAt}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>申請中の問い合わせはありません</Text>
            )}
          </View>
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
        title="営業代行を削除"
        message="この営業代行を削除してもよろしいですか？この操作は元に戻せません。"
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
  sectionContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
    marginBottom: 4,
  },
  listItemSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic" as const,
    textAlign: "center" as const,
    padding: 16,
  },
  pendingItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  inquiryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  priorityHigh: {
    backgroundColor: colors.error,
  },
  priorityMedium: {
    backgroundColor: colors.warning,
  },
  priorityLow: {
    backgroundColor: colors.textSecondary,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.background,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});