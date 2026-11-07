import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

type FaName = React.ComponentProps<typeof FontAwesome>["name"];

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftIcon?: FaName;
  onNotificationPress?: () => void;
  align?: "center" | "left";
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  leftIcon,
  onNotificationPress,
  align = "center"
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const isLeft = align === "left";

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar style="light" />
      <View style={[styles.side, isLeft && styles.sideAuto]}>
        {showBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <FontAwesome name="arrow-left" size={20} color={colors.surface} />
          </Pressable>
        ) : leftIcon ? (
          <FontAwesome name={leftIcon} size={20} color={colors.surface} />
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>

      <View style={[styles.center, isLeft && styles.centerLeft]}>
        <Text style={[styles.title, isLeft && styles.titleLeft]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, isLeft && styles.titleLeft]}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        <Pressable onPress={onNotificationPress} hitSlop={12} style={styles.iconBtn}>
          <FontAwesome name="bell" size={20} color={colors.surface} />
        </Pressable>
      </View>
    </View>
  );
}

interface ScreenShellProps {
  children: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
  tabBar?: ReactNode;
}

export function ScreenShell({ children, header, footer, tabBar }: ScreenShellProps) {
  return (
    <View style={styles.shell}>
      {header}
      <View style={styles.body}>{children}</View>
      {footer}
      {tabBar}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background
  },
  body: {
    flex: 1
  },
  header: {
    backgroundColor: colors.header,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  side: {
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  sideAuto: {
    width: "auto"
  },
  sideRight: {
    alignItems: "flex-end"
  },
  center: {
    flex: 1,
    alignItems: "center"
  },
  centerLeft: {
    alignItems: "flex-start"
  },
  title: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center"
  },
  titleLeft: {
    textAlign: "left"
  },
  subtitle: {
    color: "#c5d4e8",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center"
  },
  iconBtn: {
    padding: 4
  },
  iconSpacer: {
    width: 22,
    height: 22
  }
});
