import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useAdLocationStore } from "@/store/adLocationStore";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";

export default function EditAdLocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { adLocations, updateAdLocation } = useAdLocationStore();
  
  const adLocation = adLocations.find((location) => location.id === id);
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [hasAgreement, setHasAgreement] = useState(false);
  const [contactPerson, setContactPerson] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canEdit, setCanEdit] = useState(false);
  
  // 編集画面への直接アクセスを防ぐ
  useFocusEffect(
    React.useCallback(() => {
      const navigationState = router.canGoBack();
      if (!navigationState) {
        router.replace(`/adLocations/${id}`);
        return;
      }
      setCanEdit(true);
    }, [id, router])
  );

  useEffect(() => {
    if (adLocation && canEdit) {
      setName(adLocation.name);
      setAddress(adLocation.address);
      setBusinessType(adLocation.businessType);
      setHasAgreement(adLocation.hasAgreement);
      setContactPerson(adLocation.contactPerson);
      setContactInfo(adLocation.contactInfo);

    }
  }, [adLocation, canEdit]);
  
  if (!adLocation || !canEdit) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Button
            title="戻る"
            onPress={() => router.replace(`/adLocations/${id}`)}
            variant="outline"
          />
        </View>
      </View>
    );
  }
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "店舗名は必須です";
    }
    
    if (!address.trim()) {
      newErrors.address = "住所は必須です";
    }
    
    if (!businessType.trim()) {
      newErrors.businessType = "業種は必須です";
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
      updateAdLocation(id, {
        name,
        address,
        businessType,
        hasAgreement,
        contactPerson,
        contactInfo,

      });
      
      Alert.alert("更新完了", "広告設置先情報を更新しました", [
        {
          text: "OK",
          onPress: () => {
            router.dismiss();
            router.push(`/adLocations/${id}`);
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
            label="店舗名"
            value={name}
            onChangeText={setName}
            placeholder="例: カフェモーニング"
            error={errors.name}
          />
          
          <FormField
            label="住所"
            value={address}
            onChangeText={setAddress}
            placeholder="例: 東京都渋谷区神南1-1-1"
            error={errors.address}
          />
          
          <FormField
            label="業種"
            value={businessType}
            onChangeText={setBusinessType}
            placeholder="例: カフェ"
            error={errors.businessType}
          />
          
          <FormField
            label="同意書"
            value={hasAgreement}
            onValueChange={setHasAgreement}
            type="switch"
          />
          
          <FormField
            label="担当者"
            value={contactPerson}
            onChangeText={setContactPerson}
            placeholder="例: 山田 太郎"
            error={errors.contactPerson}
          />
          
          <FormField
            label="連絡先"
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="例: 03-1234-5678"
            keyboardType="phone-pad"
            error={errors.contactInfo}
          />
          

        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="キャンセル"
          onPress={() => router.replace(`/adLocations/${id}`)}
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