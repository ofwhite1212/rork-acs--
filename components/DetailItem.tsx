import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface DetailItemProps {
  label: string;
  value: string | number | boolean;
  type?: "text" | "money" | "boolean";
}

export default function DetailItem({ label, value, type = "text" }: DetailItemProps) {
  const renderValue = () => {
    if (type === "money" && typeof value === "number") {
      return `¥${value.toLocaleString()}`;
    } else if (type === "boolean" && typeof value === "boolean") {
      return value ? "はい" : "いいえ";
    } else {
      return value.toString();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{renderValue()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
});