import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 簡単な認証ロジック（本番環境では適切なAPIを使用）
const validateCredentials = (id: string, password: string): User | null => {
  if (id === "0001" && password === "1234") {
    return {
      id: "0001",
      name: "管理者",
    };
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: async (id: string, password: string) => {
        try {
          const user = validateCredentials(id, password);
          if (user) {
            set({ isAuthenticated: true, user });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      logout: () => {
        try {
          set({ isAuthenticated: false, user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Handle rehydration errors gracefully
        if (!state) {
          console.warn("Failed to rehydrate auth state");
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);