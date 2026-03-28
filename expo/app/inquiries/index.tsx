import React, { useState } from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useInquiryStore } from "@/store/inquiryStore";
import { Inquiry } from "@/types";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/constants/colors";
import { MessageSquare, AlertCircle, Clock, CheckCircle, Filter, Users, Store, Megaphone, User } from "lucide-react-native";

const statusLabels = {
  unread: "未読",
  read: "既読",
  resolved: "対応済み",
  pending: "未対応",
};

const statusColors = {
  unread: colors.error,
  read: colors.warning,
  resolved: colors.success,
  pending: colors.secondary,
};

const priorityLabels = {
  low: "低",
  medium: "中",
  high: "高",
};

const priorityColors = {
  low: colors.textSecondary,
  medium: colors.warning,
  high: colors.error,
};

const senderTypeLabels = {
  advertiser: "広告主",
  salesRep: "営業代行",
  adLocation: "設置先",
  general: "一般",
};

const senderTypeColors = {
  advertiser: colors.primary,
  salesRep: colors.secondary,
  adLocation: colors.success,
  general: colors.textSecondary,
};

const senderTypeIcons = {
  advertiser: Megaphone,
  salesRep: Users,
  adLocation: Store,
  general: User,
};

export default function InquiriesScreen() {
  const router = useRouter();
  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    senderTypeFilter,
    setSenderTypeFilter,
    filteredInquiries 
  } = useInquiryStore();
  
  const [showFilters, setShowFilters] = useState(false);
  
  const navigateToDetail = (id: string) => {
    router.push(`/inquiries/${id}`);
  };

  const isWeb = Platform.OS === 'web';

  const renderInquiryItem = ({ item }: { item: Inquiry }) => {
    const StatusIcon = item.status === "unread" ? AlertCircle : 
                      item.status === "read" ? Clock : CheckCircle;
    
    const SenderTypeIcon = senderTypeIcons[item.senderType as keyof typeof senderTypeIcons];
    
    return (
      <TouchableOpacity 
        style={[styles.inquiryItem, isWeb && styles.webInquiryItem]} 
        onPress={() => navigateToDetail(item.id)}
      >
        <View style={styles.inquiryHeader}>
          <View style={styles.inquiryMeta}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status as keyof typeof statusColors] }]}>
              <StatusIcon size={12} color={colors.background} />
              <Text style={styles.statusText}>{statusLabels[item.status as keyof typeof statusLabels]}</Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: priorityColors[item.priority as keyof typeof priorityColors] }]}>
              <Text style={[styles.priorityText, { color: priorityColors[item.priority as keyof typeof priorityColors] }]}>
                {priorityLabels[item.priority as keyof typeof priorityLabels]}
              </Text>
            </View>
            <View style={[styles.senderTypeBadge, { backgroundColor: senderTypeColors[item.senderType as keyof typeof senderTypeColors] }]}>
              <SenderTypeIcon size={10} color={colors.background} />
              <Text style={styles.senderTypeText}>{senderTypeLabels[item.senderType as keyof typeof senderTypeLabels]}</Text>
            </View>
          </View>
          <Text style={styles.inquiryDate}>{item.createdAt}</Text>
        </View>
        
        <Text style={styles.inquirySubject} numberOfLines={1}>
          {item.subject}
        </Text>
        <Text style={styles.inquirySender}>{item.senderName}</Text>
        <Text style={styles.inquiryContent} numberOfLines={isWeb ? 3 : 2}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isWeb) {
    return (
      <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={true}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>お問い合わせ管理</Text>
          <Text style={styles.subtitle}>ユーザーからのお問い合わせ一覧</Text>
        </View>

        {/* Filters Section */}
        <View style={styles.webFiltersContainer}>
          <View style={styles.webSearchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="件名、送信者名、メールアドレスで検索..."
            />
          </View>
          
          <View style={styles.webFiltersSection}>
            <View style={styles.webFilterGroup}>
              <Text style={styles.webFilterLabel}>ステータス:</Text>
              <View style={styles.webFilterButtons}>
                {[
                  { key: "all", label: "すべて" },
                  { key: "pending", label: "未対応" },
                  { key: "unread", label: "未読" },
                  { key: "read", label: "既読" },
                  { key: "resolved", label: "対応済み" }
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

            <View style={styles.webFilterGroup}>
              <Text style={styles.webFilterLabel}>送信者:</Text>
              <View style={styles.webFilterButtons}>
                {[
                  { key: "all", label: "すべて" },
                  { key: "advertiser", label: "広告主" },
                  { key: "salesRep", label: "営業代行" },
                  { key: "adLocation", label: "設置先" },
                  { key: "general", label: "一般" }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[styles.webFilterButton, senderTypeFilter === type.key && styles.webFilterButtonActive]}
                    onPress={() => setSenderTypeFilter(type.key as any)}
                  >
                    <Text style={[styles.webFilterButtonText, senderTypeFilter === type.key && styles.webFilterButtonTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.webFilterGroup}>
              <Text style={styles.webFilterLabel}>優先度:</Text>
              <View style={styles.webFilterButtons}>
                {[
                  { key: "all", label: "すべて" },
                  { key: "high", label: "高" },
                  { key: "medium", label: "中" },
                  { key: "low", label: "低" }
                ].map((priority) => (
                  <TouchableOpacity
                    key={priority.key}
                    style={[styles.webFilterButton, priorityFilter === priority.key && styles.webFilterButtonActive]}
                    onPress={() => setPriorityFilter(priority.key as any)}
                  >
                    <Text style={[styles.webFilterButtonText, priorityFilter === priority.key && styles.webFilterButtonTextActive]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Inquiries List */}
        <View style={styles.webInquiriesSection}>
          <Text style={styles.webSectionTitle}>
            お問い合わせ一覧 ({filteredInquiries().length}件)
          </Text>
          
          <View style={styles.webInquiriesList}>
            {filteredInquiries().length === 0 ? (
              <View style={styles.emptyContainer}>
                <MessageSquare size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>お問い合わせがありません</Text>
              </View>
            ) : (
              filteredInquiries().map((item) => (
                <View key={item.id}>
                  {renderInquiryItem({ item })}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.webBottomPadding} />
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="件名、送信者名で検索..."
      />
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} color={colors.primary} />
          <Text style={styles.filterToggleText}>フィルター</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterOptions}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>ステータス:</Text>
            <View style={styles.filterButtons}>
              {[
                { key: "all", label: "すべて" },
                { key: "pending", label: "未対応" },
                { key: "unread", label: "未読" },
                { key: "read", label: "既読" },
                { key: "resolved", label: "対応済み" }
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

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>送信者:</Text>
            <View style={styles.filterButtons}>
              {[
                { key: "all", label: "すべて" },
                { key: "advertiser", label: "広告主" },
                { key: "salesRep", label: "営業代行" },
                { key: "adLocation", label: "設置先" },
                { key: "general", label: "一般" }
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.filterButton,
                    senderTypeFilter === type.key && styles.filterButtonActive
                  ]}
                  onPress={() => setSenderTypeFilter(type.key as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    senderTypeFilter === type.key && styles.filterButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredInquiries()}
        keyExtractor={(item) => item.id}
        renderItem={renderInquiryItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>お問い合わせがありません</Text>
          </View>
        }
        style={styles.mobileList}
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
  mobileList: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  filterToggleText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: "500",
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
  inquiryItem: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inquiryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  inquiryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
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
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "500",
  },
  senderTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  senderTypeText: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.background,
  },
  inquiryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  inquirySubject: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  inquirySender: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  inquiryContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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

  // Web Styles - Completely scrollable
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
  webFilterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
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
    flexWrap: "wrap",
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
  webInquiriesSection: {
    padding: 32,
  },
  webSectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 24,
  },
  webInquiriesList: {
    gap: 16,
  },
  webInquiryItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  webBottomPadding: {
    height: 32,
  },
});