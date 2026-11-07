import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import type { TabKey } from "./BottomTabBar";
import { SideMenu } from "./SideMenu";

type Props = {
  active: TabKey;
  parentName?: string;
  unreadCount?: number;
};

const TITLES: Record<Exclude<TabKey, "home">, string> = {
  announcement: "Announcements",
  messages: "Messages",
  calendar: "Calendar",
  more: "More",
};

// Same yellow as the Consent Forms card on the home page
const YELLOW = "#FFFFFF";
const CONNECT_COLOR = "#B0E6C9";

function BrandLogo() {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const rotate = bob.interpolate({ inputRange: [0, 1], outputRange: ["-10deg", "8deg"] });

  return (
    <View style={styles.brandWrap}>
      <Animated.View style={[styles.cap, { transform: [{ translateY }, { rotate }] }]}>
        <Ionicons name="school" size={18} color={YELLOW} />
      </Animated.View>
      <Text style={styles.brand} numberOfLines={1}>
        <Text style={{ color: YELLOW }}>Vidya</Text>
        <Text style={{ color: CONNECT_COLOR }}>Connect</Text>
      </Text>
    </View>
  );
}

export function TopBar({ active, parentName, unreadCount = 0 }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = active === "home";

  return (
    <>
      <View style={[styles.bar, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => setMenuOpen(true)} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="menu" size={26} color="#ffffff" />
        </Pressable>

        <View style={styles.titleWrap}>
          {isHome ? (
            <BrandLogo />
          ) : (
            <Text style={styles.title} numberOfLines={1}>
              {TITLES[active as Exclude<TabKey, "home">]}
            </Text>
          )}
        </View>

        <Pressable
          style={styles.iconBtn}
          onPress={() => router.push("/notifications" as never)}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={26} color="#ffffff" />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        active={active}
        parentName={parentName}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.navy,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 8,
  },
  // Same size box for both icons, so they sit on the same line
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  // Fixed height so every tab's top bar is the same size
  titleWrap: { flex: 1, height: 50, justifyContent: "center" },
  // The text is centered with the icons; the cap hangs above it
  brandWrap: { alignSelf: "flex-start" },
  cap: { position: "absolute", top: -10, left: 2, zIndex: 2 },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.6,
    fontStyle: "italic",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: { color: "#ffffff", fontSize: 20, fontWeight: "700" },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D62828",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#ffffff", fontSize: 10, fontWeight: "700" },
});