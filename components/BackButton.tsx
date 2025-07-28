import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface BackButtonProps {
  title?: string;
  onPress?: () => void;
  style?: any;
}

export default function BackButton({ title = '戻る', onPress, style }: BackButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      testID="back-button"
    >
      <ArrowLeft size={20} color={colors.primary} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '500' as const,
  },
});