import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSalesRepStore } from "@/store/salesRepStore";
import SearchBar from "@/components/SearchBar";
import ListItem from "@/components/ListItem";
import FloatingActionButton from "@/components/FloatingActionButton";
import { colors } from "@/constants/colors";

export default function SalesRepsScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, filteredSalesReps } = useSalesRepStore();
  
  const navigateToDetail = (id: string) => {
    router.push(`/salesReps/${id}`);
  };
  
  const navigateToCreate = () => {
    router.push("/salesReps/create");
  };
  
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="名前、エリアで検索..."
      />
      
      <FlatList
        data={filteredSalesReps()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const contractCount = item.contractedAdvertisers.length + item.contractedAdLocations.length;
          const formattedSales = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0,
          }).format(item.salesTotal);
          
          return (
            <ListItem
              title={item.name}
              subtitle={item.area}
              onPress={() => navigateToDetail(item.id)}
              rightContent={
                <View style={styles.statsContainer}>
                  <Text style={styles.contractCount}>契約数: {contractCount}</Text>
                  <Text style={styles.salesAmount}>{formattedSales}</Text>
                </View>
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              営業代行が登録されていません
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
  statsContainer: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  contractCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  salesAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});