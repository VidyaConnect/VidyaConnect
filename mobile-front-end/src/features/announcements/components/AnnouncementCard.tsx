import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { Announcement, AnnouncementPriority } from "../types/announcement";

interface BadgeStyle {
  label: string;
  bg: string;
  text: string;
  borderColor: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
}

const PRIORITY_STYLES: Record<AnnouncementPriority, BadgeStyle> = {
  critical: { label: "Critical", bg: colors.dangerSoft, text: colors.danger, borderColor: colors.danger, icon: "exclamation-circle" },
  emergency: { label: "Critical", bg: colors.dangerSoft, text: colors.danger, borderColor: colors.danger, icon: "exclamation-circle" },
  warning: { label: "Warning", bg: colors.warningSoft, text: colors.warning, borderColor: colors.warning, icon: "exclamation-triangle" },
  urgent: { label: "Warning", bg: colors.warningSoft, text: colors.warning, borderColor: colors.warning, icon: "exclamation-triangle" },
  info: { label: "Info", bg: colors.avatarBlue, text: colors.navy, borderColor: colors.navy, icon: "info-circle" },
  normal: { label: "Info", bg: colors.avatarBlue, text: colors.navy, borderColor: colors.navy, icon: "info-circle" },
  update: { label: "Info", bg: colors.avatarBlue, text: colors.navy, borderColor: colors.navy, icon: "info-circle" },
  feature: { label: "Info", bg: colors.avatarBlue, text: colors.navy, borderColor: colors.navy, icon: "info-circle" },
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
}

export function AnnouncementCard({ announcement, onPress }: AnnouncementCardProps) {
  const style = PRIORITY_STYLES[announcement.priority] || PRIORITY_STYLES.normal;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { borderLeftColor: style.borderColor }]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: style.bg }]}>
          <FontAwesome name={style.icon} size={11} color={style.text} />
          <Text style={[styles.badgeText, { color: style.text }]}>{style.label}</Text>
        </View>
        <Text style={styles.timeText}>{timeAgo(announcement.publishDate)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {announcement.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {announcement.content}
      </Text>

      {announcement.source && (
        <View style={styles.footerRow}>
          <FontAwesome name="building-o" size={12} color={colors.textMuted} />
          <Text style={styles.sourceText}>{announcement.source}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.navy,
  },
  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  sourceText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
