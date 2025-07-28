import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { Users, Store, Megaphone, Home, User, BarChart3, CreditCard } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import WebLayout from "@/components/WebLayout";
import { Platform } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = useAuthStore.subscribe((state) => {
        setIsAuthenticated(state.isAuthenticated);
        setIsStoreReady(true);
      });

      // Get initial state
      const initialState = useAuthStore.getState();
      setIsAuthenticated(initialState.isAuthenticated);
      setIsStoreReady(true);

      return unsubscribe;
    } catch (error) {
      console.error("Auth store error in TabLayout:", error);
      setIsStoreReady(true);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isStoreReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isStoreReady]);

  if (!isStoreReady || !isAuthenticated) {
    return null;
  }

  // Web版ではカスタムレイアウトを使用
  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, // タブバーを非表示
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="salesReps/index" />
          <Tabs.Screen name="adLocations/index" />
          <Tabs.Screen name="advertisers/index" />
          <Tabs.Screen name="payments/index" />
          <Tabs.Screen name="reports" />
          <Tabs.Screen name="settings" />
        </Tabs>
      </WebLayout>
    );
  }

  // モバイル版では従来のタブレイアウト
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="salesReps/index"
        options={{
          title: "営業代行",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="adLocations/index"
        options={{
          title: "広告設置先",
          tabBarIcon: ({ color }) => <Store size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advertisers/index"
        options={{
          title: "広告主",
          tabBarIcon: ({ color }) => <Megaphone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments/index"
        options={{
          title: "支払い管理",
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "レポート",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "マイページ",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}