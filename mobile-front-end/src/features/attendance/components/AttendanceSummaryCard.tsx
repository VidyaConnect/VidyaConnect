import { StyleSheet, Text, View } from "react-native";
import { AttendanceSummary } from "../types/attendance";
import { colors } from "../../../constants/colors";

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
}

export function AttendanceSummaryCard({ summary }: AttendanceSummaryCardProps) {
  return (
    <View style={styles.row}>
      <View style={styles.metric}>
        <Text style={[styles.value, { color: colors.success }]}>{summary.present}</Text>
        <Text style={styles.label}>Present</Text>
      </View>
      <View style={styles.metric}>
        <Text style={[styles.value, { color: colors.danger }]}>{summary.absent}</Text>
        <Text style={styles.label}>Absent</Text>
      </View>
      <View style={styles.metric}>
        <Text style={[styles.value, { color: colors.latePurple }]}>{summary.late}</Text>
        <Text style={styles.label}>Late</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10
  },
  metric: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: "center"
  },
  value: {
    fontSize: 28,
    fontWeight: "800"
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4
  }
});
