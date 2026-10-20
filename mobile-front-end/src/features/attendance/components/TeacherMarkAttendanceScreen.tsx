import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AppHeader, ScreenShell } from "../../../components/layout/AppHeader";
import { SearchField } from "../../../components/ui/SearchField";
import { InitialsAvatar } from "../../../components/ui/InitialsAvatar";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { colors } from "../../../constants/colors";
import { teacherRosterMock } from "../data/mockAttendance";
import { AttendanceStatus, StudentAttendance } from "../types/attendance";

const STATUS_OPTIONS: { key: AttendanceStatus; label: string }[] = [
  { key: "present", label: "P" },
  { key: "absent", label: "A" }
];

function statusColors(status: AttendanceStatus) {
  switch (status) {
    case "present":
      return { bg: colors.successSoft, fg: colors.success };
    case "absent":
      return { bg: colors.dangerSoft, fg: colors.danger };
    case "late":
      return { bg: colors.warningSoft, fg: colors.warning };
    default:
      return { bg: colors.mutedSoft, fg: colors.textSecondary };
  }
}

export function TeacherMarkAttendanceScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roster, setRoster] = useState<StudentAttendance[]>(teacherRosterMock);

  const counts = useMemo(() => {
    return {
      present: roster.filter((s) => s.status === "present").length,
      absent: roster.filter((s) => s.status === "absent").length,
      late: roster.filter((s) => s.status === "late").length
    };
  }, [roster]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q)
    );
  }, [query, roster]);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  return (
    <ScreenShell
      header={
        <AppHeader
          title="Mark Attendance — Grade 8A"
          subtitle="— Period 5"
          showBack
          onBack={() => router.back()}
        />
      }
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label="Submit Attendance"
            color={colors.primary}
            icon={<FontAwesome name="check-circle" size={20} color="#fff" />}
            onPress={() =>
              Alert.alert("Attendance submitted", "Marks saved for Grade 8A.")
            }
          />
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{counts.present}</Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>{counts.absent}</Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
        </View>

        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search student by name or roll number..."
        />

        <View style={styles.list}>
          {filtered.map((student, index) => (
            <View key={student.id} style={styles.studentCard}>
              <InitialsAvatar name={student.name} index={index} size={48} />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.roll}>ROLL NO: {student.rollNumber}</Text>
              </View>
              <View style={styles.toggle}>
                {STATUS_OPTIONS.map((option) => {
                  const selected = student.status === option.key;
                  const tone = statusColors(option.key);
                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => setStatus(student.id, option.key)}
                      style={[
                        styles.toggleBtn,
                        selected
                          ? { backgroundColor: tone.bg }
                          : { backgroundColor: "transparent" }
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          { color: selected ? tone.fg : colors.textSecondary }
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 24
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800"
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary
  },
  list: {
    gap: 10
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text
  },
  roll: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: colors.textMuted
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.mutedSoft,
    borderRadius: 999,
    padding: 3,
    gap: 2
  },
  toggleBtn: {
    minWidth: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "800"
  },
  footer: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});
