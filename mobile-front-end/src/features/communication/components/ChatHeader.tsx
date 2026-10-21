import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/colors";

interface Props {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export function ChatHeader({ title, subtitle, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const initial = title.replace(/^(Mrs?\.|Ms\.|Dr\.)\s*/i, "").charAt(0).toUpperCase() || "T";

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.header
  },
  back: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16 },
  pressed: { backgroundColor: "rgba(255,255,255,0.15)" },
  backText: { color: colors.surface, fontSize: 24, fontWeight: "600" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.avatarTeal,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: { color: colors.primaryDark, fontWeight: "800", fontSize: 16 },
  titles: { flex: 1 },
  title: { color: colors.surface, fontSize: 16, fontWeight: "700" },
  subtitle: { color: colors.headerSubtext, fontSize: 12, marginTop: 2 }
});