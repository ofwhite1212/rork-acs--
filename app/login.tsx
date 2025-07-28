import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { Shield } from "lucide-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!id.trim()) {
      newErrors.id = "IDを入力してください";
    }
    
    if (!password.trim()) {
      newErrors.password = "パスワードを入力してください";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleLogin = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(id, password);
      
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("ログインエラー", "IDまたはパスワードが正しくありません");
      }
    } catch (error) {
      Alert.alert("エラー", "ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webLoginCard}>
          <View style={styles.webHeader}>
            <View style={styles.webIconContainer}>
              <Shield size={40} color={colors.primary} />
            </View>
            <Text style={styles.webTitle}>管理者ログイン</Text>
            <Text style={styles.webSubtitle}>エリア広告管理システム</Text>
          </View>
          
          <View style={styles.webFormContainer}>
            <FormField
              label="管理者ID"
              value={id}
              onChangeText={setId}
              placeholder="管理者IDを入力"
              error={errors.id}
            />
            
            <FormField
              label="パスワード"
              value={password}
              onChangeText={setPassword}
              placeholder="パスワードを入力"
              secureTextEntry
              error={errors.password}
            />
            
            <Button
              title="ログイン"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.webLoginButton}
            />
          </View>
          
          <View style={styles.webFooter}>
            <Text style={styles.webFooterText}>
              デモ用認証情報: ID: 0001 / PW: 1234
            </Text>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>管理者ログイン</Text>
          <Text style={styles.subtitle}>エリア広告管理システム</Text>
        </View>
        
        <View style={styles.formContainer}>
          <FormField
            label="管理者ID"
            value={id}
            onChangeText={setId}
            placeholder="管理者IDを入力"
            error={errors.id}
          />
          
          <FormField
            label="パスワード"
            value={password}
            onChangeText={setPassword}
            placeholder="パスワードを入力"
            secureTextEntry
            error={errors.password}
          />
          
          <Button
            title="ログイン"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            デモ用認証情報{"\n"}
            ID: 0001 / PW: 1234
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // モバイル用スタイル
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 32,
  },
  loginButton: {
    marginTop: 24,
  },
  footer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  
  // Web用スタイル
  webContainer: {
    flex: 1,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: 20,
  },
  webLoginCard: {
    width: 420,
    maxWidth: "100%",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  webHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  webIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  webTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  webSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  webFormContainer: {
    marginBottom: 24,
  },
  webLoginButton: {
    marginTop: 20,
    height: 44,
  },
  webFooter: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  webFooterText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
});