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
export default function CreateAnnouncementRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "super-admin") {
      router.replace("/announcements/create/super-admin");
    } else if (user.role === "school-admin") {
      router.replace("/announcements/create/school-admin");
    }
  }, [user, router]);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.navy} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!CAN_POST_ANNOUNCEMENTS.includes(user.role)) {
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
