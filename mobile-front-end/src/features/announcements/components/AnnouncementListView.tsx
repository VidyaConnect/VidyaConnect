import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TopBar } from "../../../components/layout/TopBar";
import { BottomTabBar } from "../../../components/layout/BottomTabBar";
import { colors } from "../../../constants/colors";
import { UserRole } from "../../../types";
import { Announcement, AnnouncementTag, CAN_POST_ANNOUNCEMENTS } from "../types/announcement";
import { getAnnouncements } from "../services/announcementService";
import { AnnouncementCard } from "./AnnouncementCard";

type FilterTab = "all" | "general" | "important" | "draft";

const FILTER_LABELS: Record<FilterTab, string> = {
  all: "All",
  general: "General",
  important: "Important",
  draft: "Draft",
};

// TODO: replace with real data from your auth context / API
const PARENT_NAME = "Mrs. Perera";
const UNREAD_NOTIFICATIONS = 2;

// Set to false once the announcement backend is ready
const USE_MOCK = true;

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

const MOCK_ANNOUNCEMENTS = [
  {
    id: "1",
    title: "School closed on Friday",
    content:
      "The school will remain closed this Friday due to the provincial sports meet. Classes resume on Monday at the usual time.",
    tag: "important",
    publishDate: hoursAgo(2),
    source: "Principal's Office",
  },
  {
    id: "2",
    title: "Term test timetable released",
    content:
      "The second term test timetable for Grades 6 to 11 is now available. Please make sure your child prepares ahead of time.",
    tag: "important",
    publishDate: hoursAgo(6),
    source: "Academic Division",
  },
  {
    id: "3",
    title: "Parent-teacher meeting",
    content:
      "A parent-teacher meeting will be held next Wednesday from 2:00 PM in the main hall. All parents are kindly requested to attend.",
    tag: "general",
    publishDate: hoursAgo(26),
    source: "Class Teacher",
  },
  {
    id: "4",
    title: "Sports Day practice schedule",
    content:
      "Practice sessions for Sports Day begin this week after school. Students should bring their sports kit and a water bottle.",
    tag: "general",
    publishDate: hoursAgo(50),
    source: "Sports Department",
  },
  {
    id: "5",
    title: "Library books return reminder",
    content:
      "Students are reminded to return all borrowed library books before the end of the month to avoid late fees.",
    tag: "general",
    publishDate: hoursAgo(75),
    source: "School Library",
  },
  {
    id: "6",
    title: "Vaccination programme",
    content:
      "The school health unit will carry out a vaccination programme for Grade 6 students on Thursday. Consent forms must be returned by Tuesday.",
    tag: "important",
    publishDate: hoursAgo(120),
    source: "School Health Unit",
  },
] as Announcement[];

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
    const data = USE_MOCK ? MOCK_ANNOUNCEMENTS : await getAnnouncements(role);
    setAnnouncements(data);
    setIsLoading(false);
  }, [role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const canPost = CAN_POST_ANNOUNCEMENTS.includes(role);

  const importantCount = announcements.filter((a) => a.tag === "important").length;

  const filtered = announcements.filter((a) => {
    if (filter === "all") return true;
    return a.tag === (filter as AnnouncementTag);
  });

  return (
    <View style={styles.container}>
      <TopBar
        active="announcement"
        parentName={PARENT_NAME}
        unreadCount={UNREAD_NOTIFICATIONS}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>
            {filter === "all" ? "All Announcements" : `${FILTER_LABELS[filter]} Announcements`}
          </Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{importantCount} Important</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(["all", "general", "important", "draft"] as FilterTab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setFilter(tab)}
              style={[styles.tab, filter === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
                {FILTER_LABELS[tab]}
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
          onPress={() => router.push(`/announcements/create/${role}`)}
        >
          <FontAwesome name="plus" size={22} color={colors.surface} />
        </Pressable>
      )}

      <BottomTabBar active="announcement" />
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
    flexWrap: "wrap",
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
    paddingBottom: 24,
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
    bottom: 90,
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