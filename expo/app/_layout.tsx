import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import Breadcrumb from "@/components/Breadcrumb";
import BackButton from "@/components/BackButton";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [authState, setAuthState] = useState({ isAuthenticated: false });

  // Safely access the auth store with error handling
  useEffect(() => {
    try {
      const unsubscribe = useAuthStore.subscribe((state) => {
        setAuthState({ isAuthenticated: state.isAuthenticated });
        setIsStoreReady(true);
      });

      // Get initial state
      const initialState = useAuthStore.getState();
      setAuthState({ isAuthenticated: initialState.isAuthenticated });
      setIsStoreReady(true);

      return unsubscribe;
    } catch (error) {
      console.error("Auth store error:", error);
      setIsStoreReady(true);
      setAuthState({ isAuthenticated: false });
    }
  }, []);

  // Don't render until store is ready
  if (!isStoreReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          header: () => authState.isAuthenticated ? <Breadcrumb /> : null,
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="salesReps/[id]" 
          options={{ 
            title: "営業代行詳細",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="salesReps/create" 
          options={{ 
            title: "営業代行登録",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="salesReps/edit/[id]" 
          options={{ 
            title: "営業代行編集",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="adLocations/[id]" 
          options={{ 
            title: "広告設置先詳細",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="adLocations/create" 
          options={{ 
            title: "広告設置先登録",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="adLocations/edit/[id]" 
          options={{ 
            title: "広告設置先編集",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="advertisers/[id]" 
          options={{ 
            title: "広告主詳細",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="advertisers/create" 
          options={{ 
            title: "広告主登録",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="advertisers/edit/[id]" 
          options={{ 
            title: "広告主編集",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="payments/[id]" 
          options={{ 
            title: "支払い詳細",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="inquiries/index" 
          options={{ 
            title: "お問い合わせ一覧",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
        <Stack.Screen 
          name="inquiries/[id]" 
          options={{ 
            title: "お問い合わせ詳細",
            headerBackTitle: "戻る",
            headerLeft: () => <BackButton />,
          }} 
        />
      </Stack>
    </>
  );
}