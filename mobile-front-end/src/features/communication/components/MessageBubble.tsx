import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";
import { ChatMessage, MessageStatus } from "../types/communication";
import { formatTime } from "../utils/buildChatItems";

interface Props {
  message: ChatMessage;
  onRetry: (messageId: string) => void;
}

const statusGlyph: Record<MessageStatus, string> = {
  sending: "…",
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  failed: "!"
};

export function MessageBubble({ message, onRetry }: Props) {
  const isMine = message.senderRole === "parent";
  const failed = message.status === "failed";

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs, failed && styles.bubbleFailed]}>
        <Text style={styles.body} selectable>
          {message.body}
        </Text>
      </View>

      <View style={[styles.meta, isMine ? styles.metaMine : styles.metaTheirs]}>
        <Text style={styles.time}>{formatTime(message.sentAt)}</Text>
        {isMine && (
          <Text
            style={[
              styles.status,
              message.status === "read" && styles.statusRead,
              failed && styles.statusFailed
            ]}
          >
            {statusGlyph[message.status]}
          </Text>
        )}
      </View>

      {failed && (
        <Pressable onPress={() => onRetry(message.id)} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.retry}>Failed to send. Tap to retry</Text>
        </Pressable>
      )}

      {!!message.deliveryNote && !failed && (
        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>ⓘ</Text>
          <Text style={styles.noticeText}>{message.deliveryNote}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12, maxWidth: "100%" },
  rowMine: { alignItems: "flex-end" },
  rowTheirs: { alignItems: "flex-start" },
  bubble: { maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4
  },
  bubbleTheirs: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    borderBottomLeftRadius: 4
  },
  bubbleFailed: { opacity: 0.6 },
  body: { color: colors.surface, fontSize: 15, lineHeight: 21 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, paddingHorizontal: 4 },
  metaMine: { justifyContent: "flex-end" },
  metaTheirs: { justifyContent: "flex-start" },
  time: { fontSize: 11, color: colors.textMuted },
  status: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  statusRead: { color: colors.primary },
  statusFailed: { color: colors.danger },
  retry: { marginTop: 4, fontSize: 12, fontWeight: "700", color: colors.danger },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger
  },
  noticeIcon: { color: colors.danger, fontSize: 16, fontWeight: "700" },
  noticeText: { flex: 1, color: colors.pendingText, fontSize: 13, fontWeight: "600" }
});