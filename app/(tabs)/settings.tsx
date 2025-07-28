import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useInquiryStore } from "@/store/inquiryStore";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { colors } from "@/constants/colors";
import { User, LogOut, Shield, MessageSquare, Bell, ChevronRight, AlertCircle } from "lucide-react-native";

export default function MyPageScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getUnreadCount, getPendingCount } = useInquiryStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const unreadCount = getUnreadCount();
  const pendingCount = getPendingCount();

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutModalVisible(false);
    router.replace("/login");
  };

  const navigateToInquiries = () => {
    router.push("/inquiries");
  };

  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <ScrollView style={styles.webContainer}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>マイページ</Text>
          <Text style={styles.subtitle}>アカウント管理とお知らせ</Text>
        </View>

        <View style={styles.webContent}>
          {/* User Info Card */}
          <View style={styles.webUserCard}>
            <View style={styles.webUserHeader}>
              <Text style={styles.sectionTitle}>アカウント情報</Text>
            </View>
            <View style={styles.webUserInfo}>
              <View style={styles.webUserIconContainer}>
                <User size={32} color={colors.primary} />
              </View>
              <View style={styles.webUserDetails}>
                <Text style={styles.webUserName}>{user?.name}</Text>
                <Text style={styles.webUserId}>ID: {user?.id}</Text>
                <View style={styles.webRoleContainer}>
                  <Shield size={16} color={colors.secondary} />
                  <Text style={styles.webRoleText}>管理者</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.webActionsCard}>
            <Text style={styles.sectionTitle}>クイックアクション</Text>
            
            <TouchableOpacity style={styles.webActionItem} onPress={navigateToInquiries}>
              <View style={styles.webActionIcon}>
                <MessageSquare size={24} color={colors.primary} />
              </View>
              <View style={styles.webActionContent}>
                <Text style={styles.webActionTitle}>お問い合わせ管理</Text>
                <Text style={styles.webActionDescription}>
                  ユーザーからのお問い合わせを確認・対応
                </Text>
                <View style={styles.webInquiryStats}>
                  <Text style={styles.webInquiryStatText}>未読: {unreadCount}件</Text>
                  <Text style={styles.webInquiryStatText}>未対応: {pendingCount}件</Text>
                </View>
              </View>
              {(unreadCount > 0 || pendingCount > 0) && (
                <View style={styles.webBadge}>
                  <Text style={styles.webBadgeText}>{Math.max(unreadCount, pendingCount)}</Text>
                </View>
              )}
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* System Info */}
          <View style={styles.webSystemCard}>
            <Text style={styles.sectionTitle}>システム情報</Text>
            <View style={styles.webSystemGrid}>
              <View style={styles.webSystemItem}>
                <Text style={styles.webSystemLabel}>アプリ名</Text>
                <Text style={styles.webSystemValue}>エリア広告管理システム</Text>
              </View>
              <View style={styles.webSystemItem}>
                <Text style={styles.webSystemLabel}>バージョン</Text>
                <Text style={styles.webSystemValue}>1.0.0</Text>
              </View>
              <View style={styles.webSystemItem}>
                <Text style={styles.webSystemLabel}>最終ログイン</Text>
                <Text style={styles.webSystemValue}>
                  {new Date().toLocaleDateString("ja-JP")}
                </Text>
              </View>
              <View style={styles.webSystemItem}>
                <Text style={styles.webSystemLabel}>未読問い合わせ</Text>
                <Text style={styles.webSystemValue}>{unreadCount}件</Text>
              </View>
              <View style={styles.webSystemItem}>
                <Text style={styles.webSystemLabel}>未対応問い合わせ</Text>
                <Text style={styles.webSystemValue}>{pendingCount}件</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.webLogoutContainer}>
            <Button
              title="ログアウト"
              onPress={handleLogout}
              variant="outline"
              icon={<LogOut size={20} color={colors.primary} />}
              style={styles.webLogoutButton}
            />
          </View>
        </View>

        <ConfirmationModal
          visible={logoutModalVisible}
          title="ログアウト"
          message="ログアウトしてもよろしいですか？"
          onConfirm={confirmLogout}
          onCancel={() => setLogoutModalVisible(false)}
          confirmText="ログアウト"
          cancelText="キャンセル"
        />
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント情報</Text>
          
          <View style={styles.userCard}>
            <View style={styles.userIconContainer}>
              <User size={24} color={colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userId}>ID: {user?.id}</Text>
            </View>
            <View style={styles.roleContainer}>
              <Shield size={16} color={colors.secondary} />
              <Text style={styles.roleText}>管理者</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>お知らせ・管理</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={navigateToInquiries}>
            <View style={styles.actionIcon}>
              <MessageSquare size={20} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>お問い合わせ管理</Text>
              <Text style={styles.actionDescription}>
                ユーザーからのお問い合わせを確認・対応
              </Text>
              <View style={styles.inquiryStats}>
                <Text style={styles.inquiryStatText}>未読: {unreadCount}件 | 未対応: {pendingCount}件</Text>
              </View>
            </View>
            {(unreadCount > 0 || pendingCount > 0) && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{Math.max(unreadCount, pendingCount)}</Text>
              </View>
            )}
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>システム情報</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>アプリ名</Text>
              <Text style={styles.infoValue}>エリア広告管理システム</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>バージョン</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>最終ログイン</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleDateString("ja-JP")}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>未読問い合わせ</Text>
              <Text style={styles.infoValue}>{unreadCount}件</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>未対応問い合わせ</Text>
              <Text style={styles.infoValue}>{pendingCount}件</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="ログアウト"
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={20} color={colors.primary} />}
        />
      </View>

      <ConfirmationModal
        visible={logoutModalVisible}
        title="ログアウト"
        message="ログアウトしてもよろしいですか？"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
        confirmText="ログアウト"
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondary,
    marginLeft: 4,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inquiryStats: {
    marginTop: 4,
  },
  inquiryStatText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.background,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  webContent: {
    padding: 32,
    gap: 24,
  },
  webUserCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webUserHeader: {
    marginBottom: 20,
  },
  webUserInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  webUserIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  webUserDetails: {
    flex: 1,
  },
  webUserName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  webUserId: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  webRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  webRoleText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondary,
    marginLeft: 6,
  },
  webActionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webActionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  webActionContent: {
    flex: 1,
  },
  webActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  webActionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  webInquiryStats: {
    flexDirection: "row",
    gap: 16,
  },
  webInquiryStatText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  webBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  webBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.background,
  },
  webSystemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webSystemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  webSystemItem: {
    flex: 1,
    minWidth: 180,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webSystemLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  webSystemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  webLogoutContainer: {
    alignItems: "flex-start",
  },
  webLogoutButton: {
    minWidth: 200,
  },
});