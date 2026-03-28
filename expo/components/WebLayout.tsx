import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Users, Store, Megaphone, Home, User, LogOut, BarChart3, CreditCard } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

interface WebLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: "index", label: "ホーム", icon: Home, path: "/(tabs)" },
  { name: "salesReps", label: "営業代行", icon: Users, path: "/(tabs)/salesReps" },
  { name: "adLocations", label: "広告設置先", icon: Store, path: "/(tabs)/adLocations" },
  { name: "advertisers", label: "広告主", icon: Megaphone, path: "/(tabs)/advertisers" },
  { name: "payments", label: "支払い管理", icon: CreditCard, path: "/(tabs)/payments" },
  { name: "reports", label: "レポート", icon: BarChart3, path: "/(tabs)/reports" },
  { name: "settings", label: "マイページ", icon: User, path: "/(tabs)/settings" },
];

export default function WebLayout({ children }: WebLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [logout, setLogout] = useState<(() => void) | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = useAuthStore.subscribe((state) => {
        setUser(state.user);
      });

      // Get initial state and logout function
      const state = useAuthStore.getState();
      setUser(state.user);
      setLogout(() => state.logout);

      return unsubscribe;
    } catch (error) {
      console.error("WebLayout auth store error:", error);
    }
  }, []);

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      router.replace("/login");
    }
  };

  const isActive = (itemName: string) => {
    if (itemName === "index") {
      return pathname === "/" || pathname === "/(tabs)";
    }
    return pathname.includes(itemName);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.appTitle}>エリア広告管理</Text>
          <Text style={styles.appSubtitle}>システム</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>{user?.name?.charAt(0) || "管"}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || "管理者"}</Text>
            <Text style={styles.userRole}>管理者</Text>
          </View>
        </View>

        <ScrollView style={styles.navigation}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => handleNavigation(item.path)}
              >
                <Icon 
                  size={20} 
                  color={active ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.navItemText,
                  active && styles.navItemTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color={colors.textSecondary} />
            <Text style={styles.logoutText}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.card,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 24,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  navigation: {
    flex: 1,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: colors.primaryLight,
  },
  navItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    fontWeight: "500",
  },
  navItemTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
});