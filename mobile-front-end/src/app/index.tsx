import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/colors";

const roleLabels = {
  teacher: "Teacher",
  parent: "Parent",
  "school-admin": "School Admin"
} as const;

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>VidyaConnect</Text>
        <Text style={styles.title}>Attendance workflows</Text>
        <Text style={styles.subtitle}>
          Teacher marking, parent absence response, and school admin dashboards — matching your role.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {user ? `Signed in as ${roleLabels[user.role]}` : "Not signed in"}
          </Text>
          <Text style={styles.cardText}>
            {user
              ? `${user.name} can open the ${roleLabels[user.role].toLowerCase()} attendance screen.`
              : "Sign in and pick a role to preview the Figma attendance flows."}
          </Text>
        </View>

        <PrimaryButton
          label={user ? "Open Attendance" : "Sign in to continue"}
          onPress={() => router.push(user ? "/attendance" : "/login")}
        />

        {user ? (
          <SecondaryButton label="Logout" onPress={logout} />
        ) : (
          <SecondaryButton label="Choose role" onPress={() => router.push("/login")} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 18
  },
  brand: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: colors.primary,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.navy
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.navy
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary
  }
});
