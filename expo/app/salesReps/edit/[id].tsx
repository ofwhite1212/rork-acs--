import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useSalesRepStore } from "@/store/salesRepStore";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";

export default function EditSalesRepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { salesReps, updateSalesRep } = useSalesRepStore();
  
  const salesRep = salesReps.find((rep) => rep.id === id);
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [salesTotal, setSalesTotal] = useState("");
  const [incentiveAmount, setIncentiveAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canEdit, setCanEdit] = useState(false);
  
  // 編集画面への直接アクセスを防ぐ
  useFocusEffect(
    React.useCallback(() => {
      const navigationState = router.canGoBack();
      if (!navigationState) {
        router.replace(`/salesReps/${id}`);
        return;
      }
      setCanEdit(true);
    }, [id, router])
  );

  useEffect(() => {
    if (salesRep && canEdit) {
      setName(salesRep.name);
      setContact(salesRep.contact);
      setArea(salesRep.area);
      setNotes(salesRep.notes);
      setSalesTotal(salesRep.salesTotal.toString());
      setIncentiveAmount(salesRep.incentiveAmount.toString());
    }
  }, [salesRep, canEdit]);
  
  if (!salesRep || !canEdit) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Button
            title="戻る"
            onPress={() => router.replace(`/salesReps/${id}`)}
            variant="outline"
          />
        </View>
      </View>
    );
  }
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "名前は必須です";
    }
    
    if (!contact.trim()) {
      newErrors.contact = "連絡先は必須です";
    }
    
    if (!area.trim()) {
      newErrors.area = "活動エリアは必須です";
    }
    
    if (salesTotal && isNaN(Number(salesTotal))) {
      newErrors.salesTotal = "売上合計は数値で入力してください";
    }
    
    if (incentiveAmount && isNaN(Number(incentiveAmount))) {
      newErrors.incentiveAmount = "インセンティブは数値で入力してください";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      updateSalesRep(id, {
        name,
        contact,
        area,
        notes,
        salesTotal: salesTotal ? Number(salesTotal) : 0,
        incentiveAmount: incentiveAmount ? Number(incentiveAmount) : 0,
      });
      
      Alert.alert("更新完了", "営業代行情報を更新しました", [
        {
          text: "OK",
          onPress: () => {
            router.dismiss();
            router.push(`/salesReps/${id}`);
          },
        },
      ]);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <FormField
            label="名前"
            value={name}
            onChangeText={setName}
            placeholder="例: 田中 誠"
            error={errors.name}
          />
          
          <FormField
            label="連絡先"
            value={contact}
            onChangeText={setContact}
            placeholder="例: 080-1234-5678"
            keyboardType="phone-pad"
            error={errors.contact}
          />
          
          <FormField
            label="活動エリア"
            value={area}
            onChangeText={setArea}
            placeholder="例: 東京都渋谷区"
            error={errors.area}
          />
          
          <FormField
            label="売上合計"
            value={salesTotal}
            onChangeText={setSalesTotal}
            placeholder="例: 2850000"
            keyboardType="numeric"
            error={errors.salesTotal}
          />
          
          <FormField
            label="インセンティブ"
            value={incentiveAmount}
            onChangeText={setIncentiveAmount}
            placeholder="例: 142500"
            keyboardType="numeric"
            error={errors.incentiveAmount}
          />
          
          <FormField
            label="備考"
            value={notes}
            onChangeText={setNotes}
            placeholder="例: 主に飲食店を担当"
            multiline
          />
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="キャンセル"
          onPress={() => router.replace(`/salesReps/${id}`)}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="更新"
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
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});