import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

export type TabKey = "home" | "classes" | "messages" | "calendar" | "more";

interface BottomTabBarProps {
  active: TabKey;
  onChange?: (tab: TabKey) => void;
}

const tabs: {
  key: TabKey;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
}[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "classes", label: "Classes", icon: "clipboard" },
  { key: "messages", label: "Messages", icon: "comments" },
  { key: "calendar", label: "Calendar", icon: "calendar" },
  { key: "more", label: "More", icon: "ellipsis-h" }
];

export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const color = isActive ? colors.primary : colors.textMuted;
        return (
          <Pressable
            key={tab.key}
            style={styles.item}
            onPress={() => onChange?.(tab.key)}
          >
            <FontAwesome name={tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 4
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  label: {
    fontSize: 11,
    fontWeight: "600"
  }
});
