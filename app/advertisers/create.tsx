import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAdvertiserStore } from "@/store/advertiserStore";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { TOKYO_WARDS } from "@/constants/areas";

export default function CreateAdvertiserScreen() {
  const router = useRouter();
  const { addAdvertiser } = useAdvertiserStore();
  
  const [name, setName] = useState("");
  const [adContent, setAdContent] = useState("");
  const [preferredArea, setPreferredArea] = useState<string[]>([]);
  const [period, setPeriod] = useState("");
  const [budget, setBudget] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "会社名は必須です";
    }
    
    if (!adContent.trim()) {
      newErrors.adContent = "広告内容は必須です";
    }
    
    if (preferredArea.length === 0) {
      newErrors.preferredArea = "希望エリアは必須です";
    }
    
    if (!period.trim()) {
      newErrors.period = "期間は必須です";
    }
    
    if (!budget.trim()) {
      newErrors.budget = "予算は必須です";
    } else if (isNaN(Number(budget))) {
      newErrors.budget = "予算は数値で入力してください";
    }
    
    if (!contactPerson.trim()) {
      newErrors.contactPerson = "担当者は必須です";
    }
    
    if (!contactInfo.trim()) {
      newErrors.contactInfo = "連絡先は必須です";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      addAdvertiser({
        name,
        adContent,
        preferredArea,
        period,
        budget: Number(budget),
        contactPerson,
        contactInfo,
      });
      
      Alert.alert("登録完了", "広告主を登録しました", [
        {
          text: "OK",
          onPress: () => router.replace("/advertisers"),
        },
      ]);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <FormField
            label="会社名"
            value={name}
            onChangeText={setName}
            placeholder="例: 株式会社テックイノベーション"
            error={errors.name}
          />
          
          <FormField
            label="広告内容"
            value={adContent}
            onChangeText={setAdContent}
            placeholder="例: 新サービス「クラウドX」の宣伝"
            multiline
            error={errors.adContent}
          />
          
          <FormField
            label="希望エリア"
            value={preferredArea}
            onMultiSelectChange={setPreferredArea}
            placeholder="エリアを選択してください"
            type="multiselect"
            options={TOKYO_WARDS}
            error={errors.preferredArea}
          />
          
          <FormField
            label="期間"
            value={period}
            onChangeText={setPeriod}
            placeholder="例: 2025年7月〜9月"
            error={errors.period}
          />
          
          <FormField
            label="予算（円）"
            value={budget}
            onChangeText={setBudget}
            placeholder="例: 300000"
            keyboardType="numeric"
            error={errors.budget}
          />
          
          <FormField
            label="担当者"
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="例: 中村 智"
            error={errors.contactPerson}
          />
          
          <FormField
            label="連絡先"
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="例: 03-1111-2222"
            keyboardType="phone-pad"
            error={errors.contactInfo}
          />
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="キャンセル"
          onPress={() => router.back()}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="登録"
          onPress={handleSubmit}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});