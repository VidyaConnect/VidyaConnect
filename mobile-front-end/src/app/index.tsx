import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { colors } from "../constants/colors";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.brand}>VidyaConnect</Text>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Connecting Schools, Parents and Teachers</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Get Started"
          onPress={() => router.push("/login")}
          pill
        />
        <Text style={styles.caption}>
          Building the future of education together.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 28,
    paddingTop: 100,
    paddingBottom: 40,
  },
  content: {
    alignItems: "center",
    gap: 28,
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.navy,
  },
  textBlock: {
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.navy,
    textAlign: "center",
    lineHeight: 28,
  },
  footer: {
    gap: 14,
    alignItems: "center",
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});