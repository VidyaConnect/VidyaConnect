import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppHeader } from "../../../components/layout/AppHeader";
import { colors } from "../../../constants/colors";
import { UserRole } from "../../../types";
import { Announcement, AnnouncementPriority, CAN_POST_ANNOUNCEMENTS } from "../types/announcement";
import { getAnnouncements } from "../services/announcementService";
import { AnnouncementCard } from "./AnnouncementCard";

type FilterTab = "all" | "critical" | "warning";

const TITLE_BY_ROLE: Record<string, { title: string; subtitle: string }> = {
  "super-admin": { title: "System Announcements", subtitle: "Announcements you've posted" },
  "school-admin": { title: "Announcements", subtitle: "From Super Admin" },
  teacher: { title: "Announcements", subtitle: "School & platform updates" },
  parent: { title: "Announcements", subtitle: "School & platform updates" },
  student: { title: "Announcements", subtitle: "School & platform updates" },
};

const isCritical = (p: AnnouncementPriority) => p === "critical" || p === "emergency";
const isWarning = (p: AnnouncementPriority) => p === "warning" || p === "urgent";

interface AnnouncementListViewProps {
  role: UserRole;
}

export function AnnouncementListView({ role }: AnnouncementListViewProps) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await getAnnouncements(role);
    setAnnouncements(data);
    setIsLoading(false);
  }, [role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const canPost = CAN_POST_ANNOUNCEMENTS.includes(role);
  const headerCopy = TITLE_BY_ROLE[role];

  const activeAlertCount = announcements.filter(
    (a) => isCritical(a.priority) || isWarning(a.priority)
  ).length;

  const filtered = announcements.filter((a) => {
    if (filter === "critical") return isCritical(a.priority);
    if (filter === "warning") return isWarning(a.priority);
    return true;
  });

  return (
    <View style={styles.container}>
      <AppHeader
        title={headerCopy.title}
        showBack={false}
        onNotificationPress={() => {}}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>{filter === "all" ? "All Alerts" : filter === "critical" ? "Critical Alerts" : "Warnings"}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{activeAlertCount} Active Alerts</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(["all", "critical", "warning"] as FilterTab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setFilter(tab)}
              style={[styles.tab, filter === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading announcements...</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No announcements to show.</Text>}
            renderItem={({ item }) => (
              <AnnouncementCard
                announcement={item}
                onPress={() => router.push(`/announcements/${item.id}`)}
              />
            )}
          />
        )}
      </View>

      {canPost && (
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/announcements/create")}
        >
          <FontAwesome name="plus" size={22} color={colors.surface} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.navy,
  },
  countPill: {
    backgroundColor: colors.mutedSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.mutedSoft,
  },
  tabActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingText: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 40,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});