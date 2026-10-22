import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../constants/colors";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={1000}
        accessibilityLabel="Message input"
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        style={({ pressed }) => [
          styles.send,
          !canSend && styles.sendDisabled,
          pressed && canSend && styles.sendPressed
        ]}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 22,
    backgroundColor: colors.mutedSoft,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    color: colors.text
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  sendDisabled: { backgroundColor: colors.muted },
  sendPressed: { backgroundColor: colors.primaryDark },
  sendIcon: { color: colors.surface, fontSize: 18 }
});