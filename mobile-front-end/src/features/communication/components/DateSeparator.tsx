import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

export function DateSeparator({ label }: { label: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 12
  },
  text: { fontSize: 12, fontWeight: "600", color: colors.textSecondary }
});