import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAdLocationStore } from "@/store/adLocationStore";
import SearchBar from "@/components/SearchBar";
import ListItem from "@/components/ListItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import AreaFilter from "@/components/AreaFilter";
import { colors } from "@/constants/colors";

export default function AdLocationsScreen() {
  const router = useRouter();
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedAreas,
    setSelectedAreas,
    getAvailableAreas,
    filteredAdLocations 
  } = useAdLocationStore();
  
  const navigateToDetail = (id: string) => {
    router.push(`/adLocations/${id}`);
  };
  
  const navigateToCreate = () => {
    router.push("/adLocations/create");
  };
  
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="店舗名、住所、業種で検索..."
      />
      
      <AreaFilter
        selectedAreas={selectedAreas}
        onAreasChange={setSelectedAreas}
        areas={getAvailableAreas()}
      />
      
      <FlatList
        data={filteredAdLocations()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={item.address}
            onPress={() => navigateToDetail(item.id)}
            rightContent={
              <View style={[
                styles.statusBadge,
                item.hasAgreement ? styles.agreementBadge : styles.noAgreementBadge
              ]}>
                <Text style={styles.statusText}>
                  {item.hasAgreement ? "同意済" : "未同意"}
                </Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              広告設置先が登録されていません
            </Text>
          </View>
        }
      />
      
      <FloatingActionButton onPress={navigateToCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  agreementBadge: {
    backgroundColor: colors.success,
  },
  noAgreementBadge: {
    backgroundColor: colors.warning,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.background,
  },
});