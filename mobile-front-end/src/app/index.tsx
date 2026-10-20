import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

export default function LandingPage() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#e8efee", "#ffffff", "#f3f6fd"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>
            Connecting Schools, Parents and Teachers
          </Text>
        </View>

        <View style={styles.bottom}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </Pressable>
          <Text style={styles.footer}>
            Building the future of education together.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 56
  },
  logo: { width: 400, height: 400 },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: colors.navy,
    maxWidth: 280,
    lineHeight: 26
  },
  bottom: { paddingBottom: 16, gap: 16, alignItems: "center" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary
  },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  footer: { fontSize: 12, color: colors.textSecondary }
});