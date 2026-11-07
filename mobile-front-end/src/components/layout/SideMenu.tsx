import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import type { TabKey } from "./BottomTabBar";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type Item = { key: string; label: string; icon: IconName; route?: string };

// Items without a route have no screen yet and show "Coming soon"
export const ITEMS: Item[] = [
  { key: "home", label: "Home", icon: "home-outline", route: "/home" },
  { key: "profile", label: "My Profile", icon: "person-outline", route: "/profile" },
  { key: "attendance", label: "Attendance", icon: "checkbox-outline", route: "/attendance" },
  { key: "announcement", label: "Announcements", icon: "megaphone-outline", route: "/announcements" },
  { key: "messages", label: "Messages", icon: "chatbubble-outline" },
  { key: "calendar", label: "Calendar", icon: "calendar-outline", route: "/calendar" },
  { key: "communities", label: "Communities", icon: "people-outline" },
  { key: "consent", label: "Consent Forms", icon: "create-outline" },
  { key: "notifications", label: "Notifications", icon: "notifications-outline", route: "/notifications" },
];

const PANEL_WIDTH = Math.min(Dimensions.get("window").width * 0.78, 320);

type Props = {
  visible: boolean;
  onClose: () => void;
  active: TabKey;
  parentName?: string;
};

export function SideMenu({ visible, onClose, active, parentName }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const x = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      x.setValue(-PANEL_WIDTH);
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible, x]);

  const close = (after?: () => void) => {
    Animated.timing(x, { toValue: -PANEL_WIDTH, duration: 180, useNativeDriver: true }).start(() => {
      onClose();
      after?.();
    });
  };

  const onItemPress = (item: Item) => {
    if (!item.route) {
      close(() => Alert.alert(item.label, "Coming soon."));
      return;
    }
    close(() => router.push(item.route as never));
  };

  const activeKey = active === "more" ? "profile" : active;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => close()}>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.panel,
            { width: PANEL_WIDTH, paddingTop: insets.top + 16, transform: [{ translateX: x }] },
          ]}
        >
          <View style={styles.panelHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>
                Vidya<Text style={styles.brandAccent}>Connect</Text>
              </Text>
              {parentName ? (
                <Text style={styles.parent} numberOfLines={1}>
                  {parentName}
                </Text>
              ) : null}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {ITEMS.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <Pressable
                  key={item.key}
                  style={[styles.item, isActive && styles.itemActive]}
                  onPress={() => onItemPress(item)}
                >
                  <Ionicons name={item.icon} size={22} color="#ffffff" />
                  <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Pressable style={styles.backdrop} onPress={() => close()} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  panel: {
    backgroundColor: colors.navy,
    paddingBottom: 24,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#B7C4E6",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: "#ffffff", fontSize: 20, fontWeight: "900", letterSpacing: 0.5 },
  brandAccent: { color: "#8EF2E4" },
  parent: { color: "#B7C4E6", fontSize: 13, marginTop: 2 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  itemActive: { backgroundColor: "rgba(255,255,255,0.12)" },
  itemText: { color: "#E5ECFA", fontSize: 16, fontWeight: "500" },
  itemTextActive: { color: "#ffffff", fontWeight: "800" },
});