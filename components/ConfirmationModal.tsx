import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { colors } from "@/constants/colors";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "確認",
  cancelText = "キャンセル",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              style={styles.button}
              disabled={isLoading}
            />
            <Button
              title={confirmText}
              onPress={onConfirm}
              variant="danger"
              style={styles.button}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});