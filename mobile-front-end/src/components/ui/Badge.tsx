import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { AttendanceStatus, ClassMarkStatus } from "../../features/attendance/types/attendance";

type BadgeVariant =
  | "present"
  | "absent"
  | "late"
  | "notMarked"
  | "marked"
  | "pending"
  | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const statusStyles: Record<BadgeVariant, { backgroundColor: string; color: string }> = {
  default: { backgroundColor: colors.mutedSoft, color: colors.textSecondary },
  present: { backgroundColor: colors.successSoft, color: colors.success },
  absent: { backgroundColor: colors.dangerSoft, color: colors.danger },
  late: { backgroundColor: colors.warningSoft, color: colors.warning },
  notMarked: { backgroundColor: colors.mutedSoft, color: colors.textSecondary },
  marked: { backgroundColor: colors.markedSoft, color: colors.markedText },
  pending: { backgroundColor: colors.pendingSoft, color: colors.pendingText }
};

export function statusToBadge(status: AttendanceStatus): { label: string; variant: BadgeVariant } {
  switch (status) {
    case "present":
      return { label: "Present", variant: "present" };
    case "absent":
      return { label: "Absent", variant: "absent" };
    case "late":
      return { label: "Late", variant: "late" };
    default:
      return { label: "Not Marked", variant: "notMarked" };
  }
}

export function classStatusToBadge(status: ClassMarkStatus): { label: string; variant: BadgeVariant } {
  return status === "marked"
    ? { label: "Marked", variant: "marked" }
    : { label: "Pending", variant: "pending" };
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  const style = statusStyles[variant];

  return (
    <View style={[styles.container, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start"
  },
  text: {
    fontSize: 12,
    fontWeight: "700"
  }
});
