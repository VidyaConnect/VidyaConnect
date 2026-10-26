import { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { BottomTabBar } from "../../components/layout/BottomTabBar";
import { TopBar } from "../../components/layout/TopBar";
import { useSelectedChild } from "../../features/children/hooks/selectedChild";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// TODO: replace with real data from your auth context / API
const PARENT_NAME = "Mrs. Perera";
const UNREAD_NOTIFICATIONS = 2;

type DayStatus = "P" | "A";

// TODO: replace with this week's real attendance (P = present, A = absent)
const WEEK: { day: string; full: string; status: DayStatus }[] = [
  { day: "Mon", full: "Monday", status: "P" },
  { day: "Tue", full: "Tuesday", status: "P" },
  { day: "Wed", full: "Wednesday", status: "A" },
  { day: "Thu", full: "Thursday", status: "P" },
  { day: "Fri", full: "Friday", status: "P" },
];

type Assignment = { id: string; title: string; subject: string; due: string; done: boolean };

// TODO: replace with real assignments from the assignment service.
// "done" is set by the school/teacher, not by the parent.
const ASSIGNMENTS: Assignment[] = [
  { id: "1", title: "Fractions worksheet", subject: "Maths", due: "Due Wed", done: true },
  { id: "2", title: "Plant growth report", subject: "Science", due: "Due Thu", done: false },
  { id: "3", title: "Essay: My school", subject: "English", due: "Due Fri", done: false },
];

const greetingByTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// One day in the week row. Tap it to pop the icon and show the details below.
function DayDot({
  day,
  status,
  selected,
  onPress,
}: {
  day: string;
  status: DayStatus;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const present = status === "P";

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 50, bounciness: 8 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable style={styles.dayCol} onPress={handlePress} hitSlop={6}>
      <Animated.View
        style={[
          styles.dayRing,
          selected && (present ? styles.ringPresent : styles.ringAbsent),
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.dayDot, present ? styles.dotPresent : styles.dotAbsent]}>
          <Ionicons name={present ? "checkmark" : "close"} size={18} color="#ffffff" />
        </View>
      </Animated.View>
      <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
    </Pressable>
  );
}

export default function ParentHomePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string; studentName?: string }>();
  const selectedChild = useSelectedChild();
  const studentId = params.studentId ?? selectedChild?.id;
  const studentName = params.studentName ?? selectedChild?.name;

  // Attendance card
  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const scale = useRef(new Animated.Value(1)).current;

  // Assignments card
  const [assignOpen, setAssignOpen] = useState(false);
  const assignScale = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  const selectDay = (day: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDay((cur) => (cur === day ? null : day));
  };

  const toggleAssignCard = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAssignOpen((v) => !v);
  };

  const pressIn = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 0.98, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  const pressOut = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  const selected = WEEK.find((d) => d.day === selectedDay);

  const total = ASSIGNMENTS.length;
  const doneCount = ASSIGNMENTS.filter((a) => a.done).length;
  const remaining = total - doneCount;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <View style={styles.screen}>
      <TopBar active="home" parentName={PARENT_NAME} unreadCount={UNREAD_NOTIFICATIONS} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Interactive greeting + attendance card */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            style={styles.attendanceCard}
            onPress={toggle}
            onPressIn={() => pressIn(scale)}
            onPressOut={() => pressOut(scale)}
          >
            <View style={styles.greetingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greeting}>{greetingByTime()}</Text>
                <Text style={styles.parentName} numberOfLines={1}>
                  {PARENT_NAME}
                </Text>
              </View>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={22}
                color={colors.textMuted}
              />
            </View>

            {studentName ? (
              <Pressable
                style={styles.childChip}
                onPress={() => router.push("/children")}
                hitSlop={6}
              >
                <Ionicons name="school-outline" size={14} color={TEAL} />
                <Text style={styles.childChipText} numberOfLines={1}>
                  {studentName}
                </Text>
                <View style={styles.chipDivider} />
                <Text style={styles.switchText}>Switch</Text>
                <Ionicons name="swap-horizontal" size={14} color={TEAL} />
              </Pressable>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.attendanceRow}>
              <View style={styles.attendanceIcon}>
                <Ionicons name="checkbox-outline" size={24} color={TEAL} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Attendance</Text>
                <Text style={styles.cardSub}>98% overall</Text>
              </View>
              <View style={styles.presentPill}>
                <Ionicons name="checkmark-circle" size={13} color={TEAL} />
                <Text style={styles.presentPillText}>TODAY: PRESENT</Text>
              </View>
            </View>

            {expanded ? (
              <View style={styles.weekWrap}>
                <Text style={styles.weekTitle}>This week · tap a day</Text>
                <View style={styles.weekRow}>
                  {WEEK.map((d) => (
                    <DayDot
                      key={d.day}
                      day={d.day}
                      status={d.status}
                      selected={selectedDay === d.day}
                      onPress={() => selectDay(d.day)}
                    />
                  ))}
                </View>

                {selected ? (
                  <View
                    style={[
                      styles.detailPill,
                      selected.status === "P" ? styles.detailPresent : styles.detailAbsent,
                    ]}
                  >
                    <Ionicons
                      name={selected.status === "P" ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={selected.status === "P" ? TEAL : ABSENT}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: selected.status === "P" ? TEAL : ABSENT },
                      ]}
                    >
                      {selected.full}: {selected.status === "P" ? "Present" : "Absent"}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  style={styles.attendanceLink}
                  hitSlop={8}
                  onPress={() =>
                    router.push({
                      pathname: "/attendance",
                      params: { studentId: studentId ?? "" },
                    })
                  }
                >
                  <Text style={styles.attendanceLinkText}>View full attendance</Text>
                  <Ionicons name="chevron-forward" size={16} color={TEAL} />
                </Pressable>
              </View>
            ) : null}
          </Pressable>
        </Animated.View>

        {/* Assignments (purple, read-only) */}
        <Animated.View style={{ transform: [{ scale: assignScale }] }}>
          <Pressable
            style={styles.assignCard}
            onPress={toggleAssignCard}
            onPressIn={() => pressIn(assignScale)}
            onPressOut={() => pressOut(assignScale)}
          >
            <View style={styles.assignArrowRow}>
              <Ionicons
                name={assignOpen ? "chevron-up" : "chevron-down"}
                size={22}
                color={colors.textMuted}
              />
            </View>

            <View style={styles.assignTop}>
              <View style={styles.assignIcon}>
                <Ionicons name="document-text-outline" size={24} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Assignments</Text>
                <View style={styles.pendingRow}>
                  <Ionicons
                    name={remaining === 0 ? "checkmark-circle" : "time-outline"}
                    size={13}
                    color={PURPLE}
                  />
                  <Text style={[styles.pendingText, { color: PURPLE }]}>
                    {remaining === 0 ? "All done" : `${remaining} due this week`}
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.assignLink}
                hitSlop={8}
                onPress={() =>
                  router.push({
                    pathname: "/assignments",
                    params: { studentId: studentId ?? "" },
                  })
                }
              >
                <Text style={styles.assignLinkText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color={PURPLE} />
              </Pressable>
            </View>

            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Weekly Progress</Text>
              <Text style={styles.progressLabel}>{progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            {assignOpen ? (
              <View style={styles.assignList}>
                {ASSIGNMENTS.map((a) => (
                  <View key={a.id} style={styles.assignRow}>
                    <Ionicons
                      name={a.done ? "checkmark-circle" : "time-outline"}
                      size={22}
                      color={PURPLE}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.assignTitle} numberOfLines={1}>
                        {a.title}
                      </Text>
                      <Text style={styles.assignMeta}>
                        {a.subject} · {a.due}
                      </Text>
                    </View>
                    <Text style={[styles.assignStatus, { color: PURPLE }]}>
                      {a.done ? "Done" : "Pending"}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Pressable>
        </Animated.View>

        {/* Messages (navy stripe) */}
        <Pressable style={styles.messagesCard}>
          <View style={styles.messageIcon}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color={colors.navy} />
            <View style={styles.redDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Messages</Text>
            <View style={styles.pendingRow}>
              <Ionicons name="mail-unread-outline" size={13} color={colors.navy} />
              <Text style={[styles.pendingText, { color: colors.navy }]}>2 unread</Text>
            </View>
          </View>
          <Pressable style={styles.messagesLink} hitSlop={8}>
            <Text style={styles.messagesLinkText}>Open</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.navy} />
          </Pressable>
        </Pressable>

        {/* Consent Forms */}
        <View style={styles.consentCard}>
          <View style={styles.consentIcon}>
            <Ionicons name="create-outline" size={24} color={AMBER} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Consent Forms</Text>
            <View style={styles.pendingRow}>
              <Ionicons name="warning-outline" size={13} color={AMBER_DARK} />
              <Text style={[styles.pendingText, { color: AMBER_DARK }]}>Pending signature</Text>
            </View>
          </View>
          <Pressable style={styles.consentLink} hitSlop={8}>
            <Text style={styles.consentLinkText}>Review</Text>
            <Ionicons name="chevron-forward" size={16} color="#F59E0B" />
          </Pressable>
        </View>

        {/* Next Event */}
        <View style={styles.eventCard}>
          <View style={styles.eventIcon}>
            <Ionicons name="calendar-outline" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventLabel}>NEXT EVENT</Text>
            <Text style={styles.eventTitle}>Sports Day - Dec 12</Text>
          </View>
        </View>
        <View style={styles.eventLocationRow}>
          <Ionicons name="location-outline" size={14} color="#fff" />
          <Text style={styles.eventLocation}>Main School Grounds • 08:30 AM</Text>
        </View>

        {/* School Anniversary banner */}
        <View style={styles.banner}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>School Anniversary</Text>
            <Text style={styles.bannerSub}>Celebrate 50 years of excellence this Friday.</Text>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar active="home" />
    </View>
  );
}

// Attendance card colors
const TEAL = "#0B6B5D";
const TEAL_SOFT = "#D3EBE6";
const ABSENT = "#C62828";
const ABSENT_SOFT = "#FBD5D5";
// Assignments card colors
const PURPLE = "#552586";
const PURPLE_SOFT = "#E6DDFA";
// Consent Forms card colors
const AMBER = "#E0891A";
const AMBER_DARK = "#B45309";

const NAVY = "#0B2A5B";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  content: { padding: 16, gap: 14, paddingBottom: 32 },

  cardTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 4 },
  cardSub: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  pendingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  pendingText: { fontSize: 12, fontWeight: "700" },

  // Greeting + attendance card
  attendanceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: TEAL,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  greetingRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  greeting: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  parentName: { color: "#111827", fontSize: 22, fontWeight: "800", marginTop: 2 },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: TEAL_SOFT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  childChipText: { color: TEAL, fontSize: 13, fontWeight: "700", maxWidth: 150 },
  chipDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(11,107,93,0.3)",
    marginHorizontal: 2,
  },
  switchText: { color: TEAL, fontSize: 12, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 14 },

  attendanceRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  attendanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: TEAL_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  presentPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TEAL_SOFT,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  presentPillText: { color: TEAL, fontSize: 10, fontWeight: "800" },

  // Expanded attendance
  weekWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  weekTitle: { color: colors.textSecondary, fontSize: 13, fontWeight: "700", marginBottom: 12 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: { alignItems: "center", gap: 6, flex: 1 },
  dayRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  ringPresent: { borderColor: TEAL },
  ringAbsent: { borderColor: ABSENT },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dotPresent: { backgroundColor: TEAL },
  dotAbsent: { backgroundColor: ABSENT },
  dayText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  dayTextSelected: { color: "#111827", fontWeight: "800" },
  detailPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  detailPresent: { backgroundColor: TEAL_SOFT },
  detailAbsent: { backgroundColor: ABSENT_SOFT },
  detailText: { fontSize: 13, fontWeight: "800" },
  attendanceLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 2,
    marginTop: 16,
  },
  attendanceLinkText: { color: TEAL, fontSize: 14, fontWeight: "700" },

  // Assignments card
  assignCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PURPLE,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  assignArrowRow: { alignItems: "flex-end", marginBottom: 6 },
  assignTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  assignIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: PURPLE_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  assignLink: { flexDirection: "row", alignItems: "center", gap: 2 },
  assignLinkText: { color: PURPLE, fontSize: 14, fontWeight: "700" },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  progressLabel: { fontSize: 12, fontWeight: "700", color: "#111827" },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: PURPLE, borderRadius: 999 },
  assignList: {
    marginTop: 14,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  assignRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  assignTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  assignMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  assignStatus: { fontSize: 12, fontWeight: "800" },

  // Messages card
  messagesCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.navy,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  messageIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#D6DEEE",
    alignItems: "center",
    justifyContent: "center",
  },
  redDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#C62828",
    borderWidth: 2,
    borderColor: "#D6DEEE",
  },
  messagesLink: { flexDirection: "row", alignItems: "center", gap: 2 },
  messagesLinkText: { color: colors.navy, fontSize: 14, fontWeight: "700" },

  // Consent Forms card
  consentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  consentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFF3D6",
    alignItems: "center",
    justifyContent: "center",
  },
  consentLink: { flexDirection: "row", alignItems: "center", gap: 2 },
  consentLinkText: { color: "#F59E0B", fontSize: 14, fontWeight: "700" },

  eventCard: {
    backgroundColor: NAVY,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: {
    color: "#9FB3DD",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  eventTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 2 },
  eventLocationRow: {
    backgroundColor: NAVY,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -14, // joins this row to the card above
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventLocation: { color: "#fff", fontSize: 13 },

  banner: {
    height: 190,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#4A9A9A",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  bannerOverlay: {
    padding: 16,
    backgroundColor: "rgba(10,50,60,0.55)",
  },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  bannerSub: { color: "#E5F3F3", fontSize: 14, marginTop: 4 },
});