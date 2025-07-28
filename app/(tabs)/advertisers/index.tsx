import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAdvertiserStore } from "@/store/advertiserStore";
import SearchBar from "@/components/SearchBar";
import ListItem from "@/components/ListItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import AreaFilter from "@/components/AreaFilter";
import { colors } from "@/constants/colors";

export default function AdvertisersScreen() {
  const router = useRouter();
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedAreas,
    setSelectedAreas,
    filteredAdvertisers,
    getUniqueAreas
  } = useAdvertiserStore();
  
  const navigateToDetail = (id: string) => {
    router.push(`/advertisers/${id}`);
  };
  
  const navigateToCreate = () => {
    router.push("/advertisers/create");
  };
  
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="会社名、エリア、広告内容で検索..."
      />
      
      <AreaFilter
        selectedAreas={selectedAreas}
        onAreasChange={setSelectedAreas}
        areas={getUniqueAreas()}
      />
      
      <FlatList
        data={filteredAdvertisers()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={item.preferredArea.join("、")}
            onPress={() => navigateToDetail(item.id)}
            rightContent={
              <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>
                  ¥{item.budget.toLocaleString()}
                </Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              広告主が登録されていません
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
  budgetContainer: {
    marginRight: 8,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
});