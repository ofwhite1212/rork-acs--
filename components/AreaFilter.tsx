import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface AreaFilterProps {
  selectedAreas: string[];
  onAreasChange: (areas: string[]) => void;
  areas: string[];
}

export default function AreaFilter({ selectedAreas, onAreasChange, areas }: AreaFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempSelectedAreas, setTempSelectedAreas] = useState<string[]>(selectedAreas);

  const handleAreaToggle = (area: string) => {
    if (tempSelectedAreas.includes(area)) {
      setTempSelectedAreas(tempSelectedAreas.filter(a => a !== area));
    } else {
      setTempSelectedAreas([...tempSelectedAreas, area]);
    }
  };

  const handleApplyFilter = () => {
    onAreasChange(tempSelectedAreas);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedAreas(selectedAreas);
    setIsModalVisible(false);
  };

  const getDisplayText = () => {
    if (selectedAreas.length === 0) {
      return 'すべてのエリア';
    } else if (selectedAreas.length === 1) {
      return selectedAreas[0];
    } else {
      return `${selectedAreas.length}件選択中`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>エリア</Text>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.filterText}>{getDisplayText()}</Text>
        <ChevronDown size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>エリアを選択</Text>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {areas.map((area) => {
                const isSelected = tempSelectedAreas.includes(area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={styles.optionItem}
                    onPress={() => handleAreaToggle(area)}
                  >
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkedCheckbox
                    ]}>
                      {isSelected && (
                        <Check size={16} color={colors.background} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{area}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilter}
              >
                <Text style={styles.applyButtonText}>この条件で絞り込む</Text>
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
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
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
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
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
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: '600',
  },
});