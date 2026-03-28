import React, { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";

import { useSalesRepStore } from "@/store/salesRepStore";
import { useAdLocationStore } from "@/store/adLocationStore";
import { useAdvertiserStore } from "@/store/advertiserStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/constants/colors";
import { Users, Store, Megaphone, User, TrendingUp, Plus } from "lucide-react-native";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { salesReps } = useSalesRepStore();
  const { adLocations } = useAdLocationStore();
  const { advertisers } = useAdvertiserStore();
  const { payments } = usePaymentStore();

  // 今月のデータを計算
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 今月作成された項目をフィルタリング
    const thisMonthSalesReps = salesReps.filter(rep => {
      const createdDate = new Date(rep.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    });

    const thisMonthAdLocations = adLocations.filter(location => {
      const createdDate = new Date(location.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    });

    const thisMonthAdvertisers = advertisers.filter(advertiser => {
      const createdDate = new Date(advertiser.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    });

    // 今月の売上を計算（支払い済みの金額）
    const thisMonthRevenue = payments
      .filter(payment => {
        if (payment.status !== 'paid') return false;
        const paymentDate = new Date(payment.dueDate);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((total, payment) => total + payment.amount, 0);

    return {
      newSalesReps: thisMonthSalesReps.length,
      newAdLocations: thisMonthAdLocations.length,
      newAdvertisers: thisMonthAdvertisers.length,
      monthlyRevenue: thisMonthRevenue,
    };
  }, [salesReps, adLocations, advertisers, payments]);



  const isWeb = Platform.OS === 'web';

  // Web版のレイアウト
  if (isWeb) {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webHeader}>
          <View style={styles.welcomeContainer}>
            <View style={styles.userIconContainer}>
              <User size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.welcomeText}>おかえりなさい</Text>
              <Text style={styles.userName}>{user?.name}さん</Text>
            </View>
          </View>
          <Text style={styles.webTitle}>ダッシュボード</Text>
          <Text style={styles.subtitle}>地域に根差した広告ビジネスをサポート</Text>
        </View>

        {/* 今月の売上 */}
        <View style={styles.webSectionContainer}>
          <Text style={styles.sectionTitle}>今月の売上</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueIconContainer}>
              <TrendingUp size={32} color={colors.success} />
            </View>
            <View style={styles.revenueContent}>
              <Text style={styles.revenueAmount}>
                ¥{monthlyStats.monthlyRevenue.toLocaleString()}
              </Text>
              <Text style={styles.revenueLabel}>今月の売上</Text>
            </View>
          </View>
        </View>

        {/* 今月の新規契約 */}
        <View style={styles.webSectionContainer}>
          <Text style={styles.sectionTitle}>今月の新規契約</Text>
          <View style={styles.webStatsContainer}>
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Plus size={24} color={colors.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{monthlyStats.newSalesReps}</Text>
                <Text style={styles.statLabel}>新規営業代行</Text>
              </View>
            </View>
            
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Plus size={24} color={colors.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{monthlyStats.newAdLocations}</Text>
                <Text style={styles.statLabel}>新規広告設置先</Text>
              </View>
            </View>
            
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Plus size={24} color={colors.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{monthlyStats.newAdvertisers}</Text>
                <Text style={styles.statLabel}>新規広告主</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 全体統計 */}
        <View style={styles.webSectionContainer}>
          <Text style={styles.sectionTitle}>全体統計</Text>
          <View style={styles.webStatsContainer}>
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Users size={28} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{salesReps.length}</Text>
                <Text style={styles.statLabel}>営業代行</Text>
              </View>
            </View>
            
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Store size={28} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{adLocations.length}</Text>
                <Text style={styles.statLabel}>広告設置先</Text>
              </View>
            </View>
            
            <View style={styles.webStatCard}>
              <View style={styles.statIconContainer}>
                <Megaphone size={28} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{advertisers.length}</Text>
                <Text style={styles.statLabel}>広告主</Text>
              </View>
            </View>
          </View>
        </View>


      </ScrollView>
    );
  }

  // モバイル版のレイアウト（既存）
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <View style={styles.userIconContainer}>
            <User size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.welcomeText}>おかえりなさい</Text>
            <Text style={styles.userName}>{user?.name}さん</Text>
          </View>
        </View>
        <Text style={styles.title}>エリア広告管理システム</Text>
        <Text style={styles.subtitle}>地域に根差した広告ビジネスをサポート</Text>
      </View>

      {/* 今月の売上 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>今月の売上</Text>
        <View style={styles.mobileRevenueCard}>
          <View style={styles.revenueIconContainer}>
            <TrendingUp size={28} color={colors.success} />
          </View>
          <View style={styles.revenueContent}>
            <Text style={styles.mobileRevenueAmount}>
              ¥{monthlyStats.monthlyRevenue.toLocaleString()}
            </Text>
            <Text style={styles.revenueLabel}>今月の売上</Text>
          </View>
        </View>
      </View>

      {/* 今月の新規契約 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>今月の新規契約</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Plus size={20} color={colors.success} />
            <Text style={styles.statNumber}>{monthlyStats.newSalesReps}</Text>
            <Text style={styles.statLabel}>新規営業代行</Text>
          </View>
          
          <View style={styles.statCard}>
            <Plus size={20} color={colors.success} />
            <Text style={styles.statNumber}>{monthlyStats.newAdLocations}</Text>
            <Text style={styles.statLabel}>新規設置先</Text>
          </View>
          
          <View style={styles.statCard}>
            <Plus size={20} color={colors.success} />
            <Text style={styles.statNumber}>{monthlyStats.newAdvertisers}</Text>
            <Text style={styles.statLabel}>新規広告主</Text>
          </View>
        </View>
      </View>

      {/* 全体統計 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>全体統計</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{salesReps.length}</Text>
            <Text style={styles.statLabel}>営業代行</Text>
          </View>
          
          <View style={styles.statCard}>
            <Store size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{adLocations.length}</Text>
            <Text style={styles.statLabel}>広告設置先</Text>
          </View>
          
          <View style={styles.statCard}>
            <Megaphone size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{advertisers.length}</Text>
            <Text style={styles.statLabel}>広告主</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 エリア広告管理システム</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webHeader: {
    padding: 32,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 8,
  },
  webStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: 0,
    gap: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webStatCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconContainer: {
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionContainer: {
    padding: 16,
    marginTop: 8,
  },
  webSectionContainer: {
    padding: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },

  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  revenueCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  mobileRevenueCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revenueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.successLight || colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  revenueContent: {
    flex: 1,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.success || colors.primary,
    marginBottom: 4,
  },
  mobileRevenueAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.success || colors.primary,
    marginBottom: 4,
  },
  revenueLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});