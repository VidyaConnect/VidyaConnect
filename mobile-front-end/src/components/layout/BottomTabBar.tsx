import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { ITEMS, type Item } from "./SideMenu";

export type TabKey = "home" | "announcement" | "messages" | "calendar" | "more";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { key: TabKey; label: string; route?: string; icon: IconName; activeIcon: IconName }[] = [
  { key: "home", label: "Home", route: "/home", icon: "home-outline", activeIcon: "home" },
  { key: "announcement", label: "Announcement", route: "/announcements/parent", icon: "megaphone-outline", activeIcon: "megaphone" },
  { key: "messages", label: "Messages", route: "/messages/thread-1", icon: "chatbubble-outline", activeIcon: "chatbubble" },
  { key: "calendar", label: "Calendar", route: "/calendar", icon: "calendar-outline", activeIcon: "calendar" },
  { key: "more", label: "More", icon: "ellipsis-horizontal", activeIcon: "ellipsis-horizontal" },
];

// Items that already have their own tab are not shown in "More"
const TAB_ITEM_KEYS = ["home", "announcement", "messages", "calendar"];
const MORE_ITEMS = ITEMS.filter((i) => !TAB_ITEM_KEYS.includes(i.key));

type Props = { active: TabKey };

export function BottomTabBar({ active }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [moreOpen, setMoreOpen] = useState(false);

  const onTabPress = (tab: (typeof TABS)[number]) => {
    if (tab.key === "more") {
      setMoreOpen(true);
      return;
    }
    router.push(tab.route as never);
  };

  const onItemPress = (item: Item) => {
    setMoreOpen(false);
    if (!item.route) {
      Alert.alert(item.label, "Coming soon.");
      return;
    }
    router.push(item.route as never);
  };

  return (
    <>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map((tab) => {
          const isActive = tab.key === active || (tab.key === "more" && moreOpen);
          const color = isActive ? colors.primary : colors.textSecondary;
          return (
            <Pressable key={tab.key} style={styles.tab} onPress={() => onTabPress(tab)}>
              <View style={styles.iconBox}>
                <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={22} color={color} />
              </View>
              <Text
                style={[styles.label, { color }, isActive && styles.labelActive]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* "More" sheet */}
      <Modal
        visible={moreOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMoreOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setMoreOpen(false)} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>More</Text>

            {MORE_ITEMS.map((item, i) => (
              <Pressable
                key={item.key}
                style={[styles.item, i < MORE_ITEMS.length - 1 && styles.itemBorder]}
                onPress={() => onItemPress(item)}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.navy} />
                </View>
                <Text style={styles.itemText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 0,
  },
  iconBox: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    width: "100%",
    height: 16,
    marginTop: 2,
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  labelActive: { fontWeight: "700" },

  // More sheet
  modalRoot: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D5DBE7",
    marginBottom: 14,
  },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: colors.navy, marginBottom: 6 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E6ECF8",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#111827" },
});