import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAdLocationStore } from "@/store/adLocationStore";
import DetailItem from "@/components/DetailItem";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import AdvertisementCard from "@/components/AdvertisementCard";
import { colors } from "@/constants/colors";
import { getCurrentAdvertisements, getPastAdvertisements } from "@/mocks/advertisements";

export default function AdLocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { adLocations, deleteAdLocation } = useAdLocationStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const adLocation = adLocations.find((location) => location.id === id);
  
  if (!adLocation) {
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
    router.push(`/adLocations/edit/${id}`);
  };
  
  const handleDelete = () => {
    setDeleteModalVisible(true);
  };
  
  const confirmDelete = () => {
    deleteAdLocation(id);
    setDeleteModalVisible(false);
    router.replace("/adLocations");
  };
  
  const currentAds = getCurrentAdvertisements(id);
  const pastAds = getPastAdvertisements(id);
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <DetailItem label="店舗名" value={adLocation.name} />
          <DetailItem label="住所" value={adLocation.address} />
          <DetailItem label="業種" value={adLocation.businessType} />
          <DetailItem label="同意書" value={adLocation.hasAgreement} type="boolean" />
          <DetailItem label="担当者" value={adLocation.contactPerson} />
          <DetailItem label="連絡先" value={adLocation.contactInfo} />
          <DetailItem label="登録日" value={adLocation.createdAt} />
        </View>
        
        {/* Current Advertisements */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>現在掲載中の広告</Text>
          {currentAds.length > 0 ? (
            currentAds.map((ad) => (
              <AdvertisementCard key={ad.id} advertisement={ad} />
            ))
          ) : (
            <Text style={styles.emptyText}>現在掲載中の広告はありません</Text>
          )}
        </View>
        
        {/* Past Advertisements */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>過去の掲載広告</Text>
          {pastAds.length > 0 ? (
            pastAds.map((ad) => (
              <AdvertisementCard key={ad.id} advertisement={ad} />
            ))
          ) : (
            <Text style={styles.emptyText}>過去の掲載広告はありません</Text>
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
        title="広告設置先を削除"
        message="この広告設置先を削除してもよろしいですか？この操作は元に戻せません。"
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
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    padding: 20,
    fontStyle: 'italic' as const,
  },
});