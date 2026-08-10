import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../constants/colors";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/");
    } catch {
      // error is already captured in AuthContext's `error` state
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>VidyaConnect</Text>
            <Text style={styles.tagline}>
              Empowering Education, Connecting Families
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your registered email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.passwordRow}>
              <Text style={styles.label}>Password</Text>
              <Pressable onPress={() => {}}>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </Pressable>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <PrimaryButton
              label={isLoading ? "" : "Login to Account"}
              onPress={handleLogin}
              style={styles.loginButton}
              icon={isLoading ? <ActivityIndicator color={colors.surface} /> : undefined}
            />

            <View style={styles.footerTextWrap}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <Text style={styles.footerLink}>Contact your school office.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  brand: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.navy,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.navy,
    marginTop: 12,
    marginBottom: 6,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
    gap: 10,
  },
  inputIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 12,
  },
  loginButton: {
    marginTop: 20,
  },
  footerTextWrap: {
    alignItems: "center",
    marginTop: 18,
    gap: 2,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },
});
