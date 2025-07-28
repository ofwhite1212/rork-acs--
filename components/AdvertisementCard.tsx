import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Advertisement } from '@/types';
import { colors } from '@/constants/colors';

interface AdvertisementCardProps {
  advertisement: Advertisement;
}

export default function AdvertisementCard({ advertisement }: AdvertisementCardProps) {
  const router = useRouter();

  const getStatusColor = (status: Advertisement['status']) => {
    switch (status) {
      case 'current':
        return colors.success;
      case 'past':
        return colors.textSecondary;
      case 'scheduled':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Advertisement['status']) => {
    switch (status) {
      case 'current':
        return '掲載中';
      case 'past':
        return '掲載終了';
      case 'scheduled':
        return '掲載予定';
      default:
        return '';
    }
  };

  const handlePress = () => {
    router.push(`/advertisers/${advertisement.advertiserId}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>{advertisement.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(advertisement.status) }]}>
          <Text style={styles.statusText}>{getStatusText(advertisement.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.advertiserName}>{advertisement.advertiserName}</Text>
      <Text style={styles.description} numberOfLines={2}>{advertisement.description}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.period}>
          {advertisement.startDate} ～ {advertisement.endDate}
        </Text>
        <Text style={styles.fee}>月額: ¥{advertisement.monthlyFee.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.surface,
  },
  advertiserName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  period: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  fee: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
});