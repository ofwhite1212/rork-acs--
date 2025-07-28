import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInquiryStore } from "@/store/inquiryStore";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { colors } from "@/constants/colors";
import { MessageSquare, Mail, User, Calendar, AlertCircle, Clock, CheckCircle, Users, Store, Megaphone } from "lucide-react-native";

const statusLabels = {
  unread: "未読",
  read: "既読",
  resolved: "対応済み",
};

const statusColors = {
  unread: colors.error,
  read: colors.warning,
  resolved: colors.success,
};

const priorityLabels = {
  low: "低",
  medium: "中",
  high: "高",
};

const priorityColors = {
  low: colors.textSecondary,
  medium: colors.warning,
  high: colors.error,
};

const senderTypeLabels = {
  advertiser: "広告主",
  salesRep: "営業代行",
  adLocation: "設置先",
  general: "一般",
};

const senderTypeColors = {
  advertiser: colors.primary,
  salesRep: colors.secondary,
  adLocation: colors.success,
  general: colors.textSecondary,
};

const senderTypeIcons = {
  advertiser: Megaphone,
  salesRep: Users,
  adLocation: Store,
  general: User,
};

export default function InquiryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { inquiries, updateInquiryStatus, deleteInquiry } = useInquiryStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const inquiry = inquiries.find((inq) => inq.id === id);
  
  if (!inquiry) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Button
            title="戻る"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </View>
    );
  }

  // 詳細画面を開いたら自動的に既読にする
  React.useEffect(() => {
    if (inquiry.status === "unread") {
      updateInquiryStatus(id, "read");
    }
  }, [id, inquiry.status, updateInquiryStatus]);
  
  const handleMarkAsResolved = () => {
    updateInquiryStatus(id, "resolved");
  };
  
  const handleMarkAsUnread = () => {
    updateInquiryStatus(id, "unread");
  };
  
  const handleDelete = () => {
    setDeleteModalVisible(true);
  };
  
  const confirmDelete = () => {
    deleteInquiry(id);
    setDeleteModalVisible(false);
    router.replace("/inquiries");
  };

  const StatusIcon = inquiry.status === "unread" ? AlertCircle : 
                    inquiry.status === "read" ? Clock : CheckCircle;

  const SenderTypeIcon = senderTypeIcons[inquiry.senderType];

  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webHeader}>
          <View style={styles.webHeaderContent}>
            <Text style={styles.webTitle}>お問い合わせ詳細</Text>
            <View style={styles.webStatusContainer}>
              <View style={[styles.webStatusBadge, { backgroundColor: statusColors[inquiry.status] }]}>
                <StatusIcon size={16} color={colors.background} />
                <Text style={styles.webStatusText}>{statusLabels[inquiry.status]}</Text>
              </View>
              <View style={[styles.webPriorityBadge, { borderColor: priorityColors[inquiry.priority] }]}>
                <Text style={[styles.webPriorityText, { color: priorityColors[inquiry.priority] }]}>
                  優先度: {priorityLabels[inquiry.priority]}
                </Text>
              </View>
              <View style={[styles.webSenderTypeBadge, { backgroundColor: senderTypeColors[inquiry.senderType] }]}>
                <SenderTypeIcon size={14} color={colors.background} />
                <Text style={styles.webSenderTypeText}>{senderTypeLabels[inquiry.senderType]}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.webContent}>
          <View style={styles.webMainContent}>
            <View style={styles.webInquiryCard}>
              <Text style={styles.webSubject}>{inquiry.subject}</Text>
              
              <View style={styles.webMetaInfo}>
                <View style={styles.webMetaItem}>
                  <User size={16} color={colors.textSecondary} />
                  <Text style={styles.webMetaText}>{inquiry.senderName}</Text>
                </View>
                <View style={styles.webMetaItem}>
                  <Mail size={16} color={colors.textSecondary} />
                  <Text style={styles.webMetaText}>{inquiry.senderEmail}</Text>
                </View>
                <View style={styles.webMetaItem}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={styles.webMetaText}>{inquiry.createdAt}</Text>
                </View>
                <View style={styles.webMetaItem}>
                  <SenderTypeIcon size={16} color={colors.textSecondary} />
                  <Text style={styles.webMetaText}>{senderTypeLabels[inquiry.senderType]}</Text>
                </View>
              </View>

              <View style={styles.webContentSection}>
                <Text style={styles.webContentLabel}>お問い合わせ内容</Text>
                <Text style={styles.webContentText}>{inquiry.content}</Text>
              </View>
            </View>
          </View>

          <View style={styles.webSidebar}>
            <View style={styles.webActionsCard}>
              <Text style={styles.webActionsTitle}>アクション</Text>
              
              <View style={styles.webActionButtons}>
                {inquiry.status !== "resolved" && (
                  <Button
                    title="対応済みにする"
                    onPress={handleMarkAsResolved}
                    variant="primary"
                    style={styles.webActionButton}
                  />
                )}
                
                {inquiry.status !== "unread" && (
                  <Button
                    title="未読に戻す"
                    onPress={handleMarkAsUnread}
                    variant="outline"
                    style={styles.webActionButton}
                  />
                )}
                
                <Button
                  title="削除"
                  onPress={handleDelete}
                  variant="danger"
                  style={styles.webActionButton}
                />
              </View>
            </View>
          </View>
        </View>
        
        <ConfirmationModal
          visible={deleteModalVisible}
          title="お問い合わせを削除"
          message="このお問い合わせを削除してもよろしいですか？この操作は元に戻せません。"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          confirmText="削除"
          cancelText="キャンセル"
        />
      </View>
    );
  }

  // Mobile Layout
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[inquiry.status] }]}>
              <StatusIcon size={14} color={colors.background} />
              <Text style={styles.statusText}>{statusLabels[inquiry.status]}</Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: priorityColors[inquiry.priority] }]}>
              <Text style={[styles.priorityText, { color: priorityColors[inquiry.priority] }]}>
                優先度: {priorityLabels[inquiry.priority]}
              </Text>
            </View>
            <View style={[styles.senderTypeBadge, { backgroundColor: senderTypeColors[inquiry.senderType] }]}>
              <SenderTypeIcon size={12} color={colors.background} />
              <Text style={styles.senderTypeText}>{senderTypeLabels[inquiry.senderType]}</Text>
            </View>
          </View>
          
          <Text style={styles.subject}>{inquiry.subject}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <User size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{inquiry.senderName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Mail size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{inquiry.senderEmail}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{inquiry.createdAt}</Text>
            </View>
            <View style={styles.metaItem}>
              <SenderTypeIcon size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{senderTypeLabels[inquiry.senderType]}</Text>
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.contentLabel}>お問い合わせ内容</Text>
            <Text style={styles.contentText}>{inquiry.content}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {inquiry.status !== "resolved" && (
          <Button
            title="対応済み"
            onPress={handleMarkAsResolved}
            variant="primary"
            style={styles.button}
          />
        )}
        
        {inquiry.status !== "unread" && (
          <Button
            title="未読に戻す"
            onPress={handleMarkAsUnread}
            variant="outline"
            style={styles.button}
          />
        )}
        
        <Button
          title="削除"
          onPress={handleDelete}
          variant="danger"
          style={styles.button}
        />
      </View>
      
      <ConfirmationModal
        visible={deleteModalVisible}
        title="お問い合わせを削除"
        message="このお問い合わせを削除してもよろしいですか？この操作は元に戻せません。"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="削除"
        cancelText="キャンセル"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.background,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  senderTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  senderTypeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.background,
  },
  subject: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  detailsContainer: {
    padding: 16,
  },
  metaInfo: {
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.text,
  },
  contentSection: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: 100,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webHeader: {
    padding: 32,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
  },
  webStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  webStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.background,
  },
  webPriorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  webPriorityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  webSenderTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  webSenderTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.background,
  },
  webContent: {
    flex: 1,
    flexDirection: "row",
    padding: 32,
    gap: 32,
  },
  webMainContent: {
    flex: 2,
  },
  webInquiryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webSubject: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  webMetaInfo: {
    marginBottom: 32,
    gap: 12,
  },
  webMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webMetaText: {
    fontSize: 16,
    color: colors.text,
  },
  webContentSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  webContentLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  webContentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  webSidebar: {
    flex: 1,
  },
  webActionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 20,
  },
  webActionButtons: {
    gap: 12,
  },
  webActionButton: {
    width: "100%",
  },
});