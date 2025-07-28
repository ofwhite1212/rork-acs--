import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { ChevronRight, Home } from "lucide-react-native";
import { colors } from "@/constants/colors";

const routeLabels: Record<string, string> = {
  "": "ホーム",
  "salesReps": "営業代行",
  "adLocations": "広告設置先", 
  "advertisers": "広告主",
  "create": "新規登録",
  "edit": "編集",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  
  // パスを分解してパンくずリストを作成
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // タブルートの場合は(tabs)を除去
  const cleanSegments = pathSegments.filter(segment => segment !== "(tabs)");
  
  const breadcrumbs = [
    { label: "ホーム", path: "/" },
    ...cleanSegments.map((segment, index) => {
      // 動的ルート（[id]）の場合は詳細として表示
      const isDynamicRoute = segment.match(/^[a-zA-Z0-9]+$/);
      const isEditRoute = cleanSegments[index - 1] === "edit";
      
      let label = routeLabels[segment] || segment;
      if (isDynamicRoute && !routeLabels[segment]) {
        if (isEditRoute) {
          label = "編集";
        } else {
          label = "詳細";
        }
      }
      
      const path = "/" + cleanSegments.slice(0, index + 1).join("/");
      return { label, path };
    })
  ];
  
  const navigateTo = (path: string) => {
    if (path === "/") {
      router.push("/(tabs)");
    } else {
      router.push(path);
    }
  };
  
  // ホーム画面では表示しない
  if (pathname === "/" || pathname === "/(tabs)") {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <View key={breadcrumb.path} style={styles.breadcrumbItem}>
            <TouchableOpacity
              style={styles.breadcrumbButton}
              onPress={() => navigateTo(breadcrumb.path)}
              disabled={index === breadcrumbs.length - 1}
            >
              {index === 0 && (
                <Home size={16} color={colors.primary} style={styles.homeIcon} />
              )}
              <Text
                style={[
                  styles.breadcrumbText,
                  index === breadcrumbs.length - 1 && styles.currentBreadcrumb
                ]}
              >
                {breadcrumb.label}
              </Text>
            </TouchableOpacity>
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={16} color={colors.textSecondary} style={styles.separator} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  homeIcon: {
    marginRight: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  currentBreadcrumb: {
    color: colors.text,
    fontWeight: "600",
  },
  separator: {
    marginHorizontal: 4,
  },
});