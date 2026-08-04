import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Badge, statusToBadge } from "../../../components/ui/Badge";
import { InitialsAvatar } from "../../../components/ui/InitialsAvatar";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { colors } from "../../../constants/colors";
import { AdminClassAttendance } from "../types/attendance";

interface StudentRosterModalProps {
  visible: boolean;
  classItem: AdminClassAttendance | null;
  onClose: () => void;
  onEditRoster?: () => void;
}

export function StudentRosterModal({
  visible,
  classItem,
  onClose,
  onEditRoster
}: StudentRosterModalProps) {
  if (!classItem) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{classItem.className}</Text>
              <Text style={styles.subtitle}>
                {classItem.teacherName} — Student Roster
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <FontAwesome name="times" size={22} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.divider} />

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {classItem.students.map((student, index) => {
              const badge = statusToBadge(student.status);
              return (
                <View key={student.id} style={styles.row}>
                  <InitialsAvatar name={student.name} index={index} size={46} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{student.name}</Text>
                    <Text style={styles.roll}>Roll: {student.rollNumber}</Text>
                  </View>
                  <Badge label={badge.label} variant={badge.variant} />
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton
              label="Edit Roster"
              onPress={onEditRoster ?? onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end"
  },
  dismissArea: {
    flex: 1
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "82%",
    paddingTop: 10
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#cbd5e1",
    marginBottom: 10
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary
  },
  closeBtn: {
    padding: 4
  },
  divider: {
    height: 1,
    backgroundColor: colors.border
  },
  list: {
    maxHeight: 420
  },
  listContent: {
    paddingHorizontal: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
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
    marginTop: 3,
    fontSize: 13,
    color: colors.textMuted
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: colors.border
  }
});
