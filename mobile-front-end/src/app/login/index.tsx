import { useRouter } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../constants/colors";
import { UserRole } from "../../types";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();

  const handleLogin = async (role: UserRole) => {
    await loginAs(role);
    router.replace("/attendance");
  };

  return (
    <ScreenContainer>
      <View style={styles.wrapper}>
        <Text style={styles.brand}>VidyaConnect</Text>
        <Text style={styles.title}>Choose your role</Text>
        <Text style={styles.subtitle}>
          Open the attendance experience designed for teachers, parents, or school admins.
        </Text>

        <View style={styles.buttonGroup}>
          <PrimaryButton label="Teacher" onPress={() => handleLogin("teacher")} />
          <PrimaryButton label="School Admin" onPress={() => handleLogin("school-admin")} />
          <PrimaryButton label="Parent" onPress={() => handleLogin("parent")} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
    gap: 14,
    flex: 1,
    justifyContent: "center"
  },
  brand: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: colors.primary,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.navy
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 8
  },
  buttonGroup: {
    gap: 14,
    marginTop: 8
  }
});
