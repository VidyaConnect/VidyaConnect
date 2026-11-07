import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
}

export function SecondaryButton({ label, onPress }: SecondaryButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center"
  },
  text: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700"
  }
});
