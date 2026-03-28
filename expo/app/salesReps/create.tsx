import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Alert, Text, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useSalesRepStore } from "@/store/salesRepStore";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { TOKYO_WARDS } from "@/constants/areas";
import { ChevronDown, Check } from "lucide-react-native";

export default function CreateSalesRepScreen() {
  const router = useRouter();
  const { addSalesRep } = useSalesRepStore();
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      addSalesRep({
        name,
        contact,
        area,
        notes,
        salesTotal: 0,
        incentiveAmount: 0,
      });
      
      Alert.alert("登録完了", "営業代行を登録しました", [
        {
          text: "OK",
          onPress: () => router.replace("/salesReps"),
        },
      ]);
    }
  };

  const handleAreaSelect = (selectedArea: string) => {
    setArea(selectedArea);
    setIsAreaModalVisible(false);
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
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>活動エリア</Text>
            <TouchableOpacity
              style={[
                styles.areaSelector,
                errors.area && styles.errorField
              ]}
              onPress={() => setIsAreaModalVisible(true)}
            >
              <Text style={[
                styles.areaSelectorText,
                !area && styles.placeholderText
              ]}>
                {area || "エリアを選択してください"}
              </Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {errors.area && (
              <Text style={styles.errorText}>{errors.area}</Text>
            )}
          </View>
          
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

      <Modal
        visible={isAreaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAreaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>活動エリアを選択</Text>
            </View>
            
            <ScrollView style={styles.areaList}>
              {TOKYO_WARDS.map((ward) => (
                <TouchableOpacity
                  key={ward}
                  style={styles.areaItem}
                  onPress={() => handleAreaSelect(ward)}
                >
                  <Text style={styles.areaItemText}>{ward}</Text>
                  {area === ward && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAreaModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  areaSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  areaSelectorText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  errorField: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  areaList: {
    maxHeight: 300,
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  areaItemText: {
    fontSize: 16,
    color: colors.text,
  },
  modalActions: {
    padding: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});