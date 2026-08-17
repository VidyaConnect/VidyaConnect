import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { CAN_POST_ANNOUNCEMENTS } from "../../../features/announcements/types/announcement";
import { colors } from "../../../constants/colors";

/**
 * Legacy /announcements/create entry — redirects to the role-specific compose screen.
 * Only Super Admin and School Admin can post; other roles see an access message.
 */

// TODO: confirm with Sehajinie that "ADMIN" is the correct backend value for Super Admin.
// Maps the real backend role (e.g. "ADMIN", "SCHOOL_ADMIN") to the local
// super-admin/school-admin convention already used across the announcement feature.
function toLocalRole(backendRole: string | undefined): "super-admin" | "school-admin" | null {
  if (backendRole === "ADMIN") return "super-admin";
  if (backendRole === "SCHOOL_ADMIN") return "school-admin";
  return null;
}

export default function CreateAnnouncementRedirect() {
  const router = useRouter();
  const { user } = useAuth();
  const localRole = toLocalRole(user?.role);

  useEffect(() => {
    if (!user) return;

    if (localRole === "super-admin") {
      router.replace("/announcements/create/super-admin");
    } else if (localRole === "school-admin") {
      router.replace("/announcements/create/school-admin");
    }
  }, [user, localRole, router]);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.navy} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!localRole || !CAN_POST_ANNOUNCEMENTS.includes(localRole)) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Access restricted</Text>
        <Text style={styles.text}>
          Only School Admin and Super Admin can post announcements.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.navy} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.navy,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
