import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { AdminAttendanceDashboardScreen } from "../../features/attendance/components/AdminAttendanceDashboardScreen";
import { ParentAbsenceResponseScreen } from "../../features/attendance/components/ParentAbsenceResponseScreen";
import { TeacherMarkAttendanceScreen } from "../../features/attendance/components/TeacherMarkAttendanceScreen";
import { PrimaryButton } from "../../components/ui/PrimaryButton";

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!user) {
    return (
      <View style={[styles.gate, { paddingTop: insets.top + 24 }]}>
        <FontAwesome name="lock" size={36} color={colors.primary} />
        <Text style={styles.gateTitle}>Sign in required</Text>
        <Text style={styles.gateText}>
          Choose a role to open the matching attendance experience.
        </Text>
        <PrimaryButton label="Go to login" onPress={() => router.replace("/login")} />
      </View>
    );
  }

  if (user.role === "teacher") {
    return <TeacherMarkAttendanceScreen />;
  }

  if (user.role === "parent") {
    return <ParentAbsenceResponseScreen />;
  }

  return <AdminAttendanceDashboardScreen />;
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    gap: 12,
    justifyContent: "center"
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text
  },
  gateText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 8
  }
});
