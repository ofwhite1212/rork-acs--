import React, { useMemo } from "react";
import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import { useAdLocationStore } from "@/store/adLocationStore";
import { useAdvertiserStore } from "@/store/advertiserStore";
import { colors } from "@/constants/colors";
import { TrendingUp, DollarSign, Calendar, BarChart3, PieChart, Target } from "lucide-react-native";

export default function ReportsScreen() {
  const { adLocations } = useAdLocationStore();
  const { advertisers } = useAdvertiserStore();

  const reportData = useMemo(() => {
    // 月間収益計算
    const monthlyRevenue = adLocations.reduce((sum, location) => sum + location.fee, 0);
    
    // 年間収益予測
    const annualRevenue = monthlyRevenue * 12;
    
    // 業種別収益
    const revenueByType = adLocations.reduce((acc, location) => {
      acc[location.businessType] = (acc[location.businessType] || 0) + location.fee;
      return acc;
    }, {} as Record<string, number>);
    
    // 広告主予算合計
    const totalAdvertiserBudget = advertisers.reduce((sum, advertiser) => sum + advertiser.budget, 0);
    
    // 平均設置料
    const averageFee = adLocations.length > 0 ? monthlyRevenue / adLocations.length : 0;
    
    // 同意率
    const agreementRate = adLocations.length > 0 
      ? (adLocations.filter(loc => loc.hasAgreement).length / adLocations.length) * 100 
      : 0;

    return {
      monthlyRevenue,
      annualRevenue,
      revenueByType,
      totalAdvertiserBudget,
      averageFee,
      agreementRate,
    };
  }, [adLocations, advertisers]);

  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>売上レポート</Text>
          <Text style={styles.subtitle}>収益分析とビジネス指標</Text>
        </View>

        {/* KPI Cards - Web Grid Layout */}
        <View style={styles.webKpiGrid}>
          <View style={styles.webKpiCard}>
            <View style={styles.kpiIconContainer}>
              <DollarSign size={28} color={colors.primary} />
            </View>
            <View style={styles.kpiContent}>
              <Text style={styles.kpiValue}>¥{reportData.monthlyRevenue.toLocaleString()}</Text>
              <Text style={styles.kpiLabel}>月間収益</Text>
            </View>
          </View>

          <View style={styles.webKpiCard}>
            <View style={styles.kpiIconContainer}>
              <TrendingUp size={28} color={colors.secondary} />
            </View>
            <View style={styles.kpiContent}>
              <Text style={styles.kpiValue}>¥{reportData.annualRevenue.toLocaleString()}</Text>
              <Text style={styles.kpiLabel}>年間予測収益</Text>
            </View>
          </View>

          <View style={styles.webKpiCard}>
            <View style={styles.kpiIconContainer}>
              <Target size={28} color={colors.success} />
            </View>
            <View style={styles.kpiContent}>
              <Text style={styles.kpiValue}>{reportData.agreementRate.toFixed(1)}%</Text>
              <Text style={styles.kpiLabel}>同意率</Text>
            </View>
          </View>

          <View style={styles.webKpiCard}>
            <View style={styles.kpiIconContainer}>
              <BarChart3 size={28} color={colors.warning} />
            </View>
            <View style={styles.kpiContent}>
              <Text style={styles.kpiValue}>¥{reportData.averageFee.toLocaleString()}</Text>
              <Text style={styles.kpiLabel}>平均設置料</Text>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.webChartsContainer}>
          <View style={styles.webChartCard}>
            <View style={styles.chartHeader}>
              <PieChart size={24} color={colors.primary} />
              <Text style={styles.chartTitle}>業種別収益分析</Text>
            </View>
            <View style={styles.chartContent}>
              {Object.entries(reportData.revenueByType).map(([type, revenue]) => (
                <View key={type} style={styles.chartItem}>
                  <View style={styles.chartItemHeader}>
                    <Text style={styles.chartItemLabel}>{type}</Text>
                    <Text style={styles.chartItemValue}>¥{revenue.toLocaleString()}</Text>
                  </View>
                  <View style={styles.chartBar}>
                    <View 
                      style={[
                        styles.chartBarFill, 
                        { width: `${(revenue / reportData.monthlyRevenue) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.webChartCard}>
            <View style={styles.chartHeader}>
              <Calendar size={24} color={colors.secondary} />
              <Text style={styles.chartTitle}>月次推移予測</Text>
            </View>
            <View style={styles.chartContent}>
              <View style={styles.monthlyProjection}>
                <Text style={styles.projectionText}>
                  現在の設置先数: {adLocations.length}店舗
                </Text>
                <Text style={styles.projectionText}>
                  月間収益: ¥{reportData.monthlyRevenue.toLocaleString()}
                </Text>
                <Text style={styles.projectionText}>
                  広告主予算総額: ¥{reportData.totalAdvertiserBudget.toLocaleString()}
                </Text>
                <View style={styles.projectionHighlight}>
                  <Text style={styles.projectionHighlightText}>
                    収益化可能性: {((reportData.monthlyRevenue / reportData.totalAdvertiserBudget) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Detailed Analysis */}
        <View style={styles.webAnalysisSection}>
          <Text style={styles.sectionTitle}>詳細分析</Text>
          <View style={styles.webAnalysisGrid}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>収益性分析</Text>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisItem}>
                  • 最高収益業種: {Object.entries(reportData.revenueByType).sort(([,a], [,b]) => b - a)[0]?.[0] || "なし"}
                </Text>
                <Text style={styles.analysisItem}>
                  • 平均設置料: ¥{reportData.averageFee.toLocaleString()}
                </Text>
                <Text style={styles.analysisItem}>
                  • 同意済み店舗: {adLocations.filter(loc => loc.hasAgreement).length}店舗
                </Text>
              </View>
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>成長機会</Text>
              <View style={styles.analysisContent}>
                <Text style={styles.analysisItem}>
                  • 未同意店舗: {adLocations.filter(loc => !loc.hasAgreement).length}店舗
                </Text>
                <Text style={styles.analysisItem}>
                  • 潜在収益: ¥{(adLocations.filter(loc => !loc.hasAgreement).reduce((sum, loc) => sum + loc.fee, 0)).toLocaleString()}
                </Text>
                <Text style={styles.analysisItem}>
                  • 広告主数: {advertisers.length}社
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>売上レポート</Text>
        <Text style={styles.subtitle}>収益分析とビジネス指標</Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <DollarSign size={24} color={colors.primary} />
          <Text style={styles.kpiValue}>¥{reportData.monthlyRevenue.toLocaleString()}</Text>
          <Text style={styles.kpiLabel}>月間収益</Text>
        </View>

        <View style={styles.kpiCard}>
          <TrendingUp size={24} color={colors.secondary} />
          <Text style={styles.kpiValue}>¥{reportData.annualRevenue.toLocaleString()}</Text>
          <Text style={styles.kpiLabel}>年間予測</Text>
        </View>
      </View>

      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Target size={24} color={colors.success} />
          <Text style={styles.kpiValue}>{reportData.agreementRate.toFixed(1)}%</Text>
          <Text style={styles.kpiLabel}>同意率</Text>
        </View>

        <View style={styles.kpiCard}>
          <BarChart3 size={24} color={colors.warning} />
          <Text style={styles.kpiValue}>¥{reportData.averageFee.toLocaleString()}</Text>
          <Text style={styles.kpiLabel}>平均設置料</Text>
        </View>
      </View>

      {/* Business Type Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>業種別収益</Text>
        <View style={styles.chartCard}>
          {Object.entries(reportData.revenueByType).map(([type, revenue]) => (
            <View key={type} style={styles.chartItem}>
              <View style={styles.chartItemHeader}>
                <Text style={styles.chartItemLabel}>{type}</Text>
                <Text style={styles.chartItemValue}>¥{revenue.toLocaleString()}</Text>
              </View>
              <View style={styles.chartBar}>
                <View 
                  style={[
                    styles.chartBarFill, 
                    { width: `${(revenue / reportData.monthlyRevenue) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>サマリー</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryItem}>設置先数: {adLocations.length}店舗</Text>
          <Text style={styles.summaryItem}>広告主数: {advertisers.length}社</Text>
          <Text style={styles.summaryItem}>
            広告主予算総額: ¥{reportData.totalAdvertiserBudget.toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartItem: {
    marginBottom: 16,
  },
  chartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chartItemLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  chartItemValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  chartBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  chartBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    paddingVertical: 4,
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
  webKpiGrid: {
    flexDirection: "row",
    padding: 32,
    gap: 24,
  },
  webKpiCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiIconContainer: {
    marginRight: 16,
  },
  kpiContent: {
    flex: 1,
  },
  webChartsContainer: {
    flexDirection: "row",
    padding: 32,
    gap: 24,
  },
  webChartCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  chartContent: {
    flex: 1,
  },
  monthlyProjection: {
    padding: 16,
  },
  projectionText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  projectionHighlight: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  projectionHighlightText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  webAnalysisSection: {
    padding: 32,
  },
  webAnalysisGrid: {
    flexDirection: "row",
    gap: 24,
  },
  analysisCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  analysisContent: {
    flex: 1,
  },
  analysisItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});