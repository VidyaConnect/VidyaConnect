import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

const AVATAR_PALETTE = [
  colors.avatarBlue,
  colors.avatarPurple,
  colors.avatarTeal,
  colors.avatarLavender,
  "#cffafe"
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface InitialsAvatarProps {
  name: string;
  size?: number;
  index?: number;
}

export function InitialsAvatar({ name, size = 44, index = 0 }: InitialsAvatarProps) {
  const backgroundColor = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor
        }
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center"
  },
  initials: {
    fontWeight: "700",
    color: colors.navy
  }
});
