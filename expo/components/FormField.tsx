import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Switch, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface FormFieldProps {
  label: string;
  value: string | boolean | string[];
  onChangeText?: (text: string) => void;
  onValueChange?: (value: boolean) => void;
  onMultiSelectChange?: (values: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  type?: "text" | "switch" | "select" | "multiselect";
  options?: readonly string[];
  error?: string;
}

export default function FormField({
  label,
  value,
  onChangeText,
  onValueChange,
  onMultiSelectChange,
  placeholder,
  multiline = false,
  keyboardType = "default",
  secureTextEntry = false,
  type = "text",
  options = [],
  error,
}: FormFieldProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleMultiSelectToggle = (item: string) => {
    const currentValues = value as string[];
    const newValues = currentValues.includes(item)
      ? currentValues.filter(v => v !== item)
      : [...currentValues, item];
    onMultiSelectChange?.(newValues);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {type === "text" && (
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError,
          ]}
          value={value as string}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          multiline={multiline}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
      )}
      
      {type === "switch" && (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      )}
      
      {type === "select" && (
        <>
          <TouchableOpacity
            style={[
              styles.selectButton,
              error && styles.inputError,
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={[
              styles.selectText,
              !value && styles.placeholderText
            ]}>
              {value || placeholder}
            </Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Modal
            visible={isModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setIsModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{label}を選択</Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        onChangeText?.(item);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                      {value === item && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
      
      {type === "multiselect" && (
        <>
          <TouchableOpacity
            style={[
              styles.selectButton,
              error && styles.inputError,
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={[
              styles.selectText,
              (!value || (value as string[]).length === 0) && styles.placeholderText
            ]}>
              {(value as string[])?.length > 0 
                ? `${(value as string[]).length}件選択済み`
                : placeholder
              }
            </Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {(value as string[])?.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              {(value as string[]).map((item) => (
                <View key={item} style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
          
          <Modal
            visible={isModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setIsModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{label}を選択（複数選択可）</Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => handleMultiSelectToggle(item)}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                      {(value as string[])?.includes(item) && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.doneButtonText}>完了</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  multilineInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.placeholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  selectedItem: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  doneButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});