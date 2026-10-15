import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { colors } from "../../constants/colors";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  pill?: boolean;
  style?: ViewStyle;
  color?: string;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  pill = false,
  style,
  color = colors.primary
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: color, borderRadius: pill ? 999 : 14 },
        style
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10
  },
  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700"
  }
});
