import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppHeader, ScreenShell } from "../../../components/layout/AppHeader";
import { BottomTabBar } from "../../../components/layout/BottomTabBar";
import { SearchField } from "../../../components/ui/SearchField";
import { Badge, classStatusToBadge } from "../../../components/ui/Badge";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { colors } from "../../../constants/colors";
import { adminOverviewMock } from "../data/mockAttendance";
import { AdminClassAttendance } from "../types/attendance";
import { StudentRosterModal } from "./StudentRosterModal";

type FilterKey = "all" | "marked" | "pending";

export function AdminAttendanceDashboardScreen() {
  const overview = adminOverviewMock;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedClass, setSelectedClass] = useState<AdminClassAttendance | null>(null);

  const classes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return overview.classes.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "marked" && item.status === "marked") ||
        (filter === "pending" && item.status === "pending");
      const matchesQuery =
        !q ||
        item.className.toLowerCase().includes(q) ||
        item.teacherName.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, overview.classes, query]);

  return (
    <ScreenShell
      header={
        <AppHeader
          title="Attendance — Today"
          leftIcon="university"
          align="left"
        />
      }
      footer={
        <View style={styles.exportWrap}>
          <PrimaryButton
            label="Export Report"
            color={colors.header}
            icon={<FontAwesome name="download" size={18} color="#fff" />}
            onPress={() => Alert.alert("Export", "Attendance report export started.")}
            style={styles.exportBtn}
          />
        </View>
      }
      tabBar={<BottomTabBar active="classes" />}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard label="Present" value={overview.present} accent={colors.success} />
          <StatCard label="Absent" value={overview.absent} accent={colors.danger} />
          <StatCard label="Late" value={overview.late} accent={colors.warning} />
          <StatCard label="Not Marked" value={overview.notMarked} accent={colors.muted} />
        </View>

        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search classes or teachers..."
        />

        <View style={styles.filters}>
          {([
            ["all", "All"],
            ["marked", "Marked"],
            ["pending", "Pending"]
          ] as const).map(([key, label]) => {
            const active = filter === key;
            return (
              <Pressable
                key={key}
                onPress={() => setFilter(key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.classList}>
          {classes.map((item) => {
            const badge = classStatusToBadge(item.status);
            return (
              <View key={item.id} style={styles.classCard}>
                <View style={styles.classTop}>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{item.className}</Text>
                    <Text style={styles.teacherName}>{item.teacherName}</Text>
                  </View>
                  <Badge label={badge.label} variant={badge.variant} />
                </View>

                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Attendance Progress</Text>
                  <Text style={styles.progressValue}>{item.progress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.progress}%`,
                        backgroundColor:
                          item.progress === 0 ? colors.border : colors.primary
                      }
                    ]}
                  />
                </View>

                <Pressable
                  style={styles.viewLink}
                  onPress={() => setSelectedClass(item)}
                >
                  <Text style={styles.viewLinkText}>View Students</Text>
                  <FontAwesome name="chevron-right" size={14} color={colors.primary} />
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <StudentRosterModal
        visible={!!selectedClass}
        classItem={selectedClass}
        onClose={() => setSelectedClass(null)}
        onEditRoster={() => {
          Alert.alert("Edit Roster", `Editing ${selectedClass?.className ?? "class"}`);
          setSelectedClass(null);
        }}
      />
    </ScreenShell>
  );
}

function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statAccent, { backgroundColor: accent }]} />
      <View style={styles.statBody}>
        <Text style={[styles.statLabel, { color: accent }]}>{label}</Text>
        <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 20
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statCard: {
    width: "48%",
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 76
  },
  statAccent: {
    width: 5
  },
  statBody: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "center"
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  statValue: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "800"
  },
  filters: {
    flexDirection: "row",
    gap: 8
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary
  },
  chipTextActive: {
    color: colors.surface
  },
  classList: {
    gap: 12
  },
  classCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10
  },
  classTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10
  },
  classInfo: {
    flex: 1
  },
  className: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text
  },
  teacherName: {
    marginTop: 3,
    fontSize: 13,
    color: colors.textSecondary
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.mutedSoft,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  viewLink: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 2
  },
  viewLinkText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13
  },
  exportWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.background
  },
  exportBtn: {
    borderRadius: 14
  }
});
