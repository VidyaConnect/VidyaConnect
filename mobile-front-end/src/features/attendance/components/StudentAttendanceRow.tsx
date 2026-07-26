import { StyleSheet, Text, View } from "react-native";
import { StudentAttendance } from "../types/attendance";
import { Badge, statusToBadge } from "../../../components/ui/Badge";
import { InitialsAvatar } from "../../../components/ui/InitialsAvatar";
import { colors } from "../../../constants/colors";

interface StudentAttendanceRowProps {
  student: StudentAttendance;
  index?: number;
}

export function StudentAttendanceRow({ student, index = 0 }: StudentAttendanceRowProps) {
  const status = statusToBadge(student.status);

  return (
    <View style={styles.card}>
      <InitialsAvatar name={student.name} index={index} size={44} />
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.roll}>Roll: {student.rollNumber}</Text>
      </View>
      <Badge label={status.label} variant={status.variant} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text
  },
  roll: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3
  }
});
