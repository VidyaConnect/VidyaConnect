import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../constants/colors";
import { PickedFile } from "../types/communication";

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  onSend: (text: string, files: PickedFile[]) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<PickedFile[]>([]);
  const insets = useSafeAreaInsets();
  const canSend = (text.trim().length > 0 || files.length > 0) && !disabled;

  const pickFiles = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        multiple: true,
        copyToCacheDirectory: true
      });

      // Handles both result shapes used by different expo-document-picker versions.
      if (result.canceled === true || result.type === "cancel") return;
      const assets: any[] = result.assets ?? [result];

      const picked: PickedFile[] = assets.map((a) => ({
        uri: a.uri,
        name: a.name ?? "file",
        size: a.size ?? 0,
        mimeType: a.mimeType
      }));

      const tooBig = picked.find((f) => f.size > MAX_BYTES);
      if (tooBig) {
        Alert.alert("File too large", `${tooBig.name} is larger than 10 MB.`);
        return;
      }
      if (files.length + picked.length > MAX_FILES) {
        Alert.alert("Too many files", `You can attach up to ${MAX_FILES} files per message.`);
        return;
      }
      setFiles((prev) => [...prev, ...picked]);
    } catch {
      Alert.alert("Could not open files", "Please try again.");
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend(text, files);
    setText("");
    setFiles([]);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {files.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {files.map((f, i) => (
            <View key={`${f.name}-${i}`} style={styles.chip}>
              <Ionicons name="document-text-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.chipText} numberOfLines={1}>{f.name}</Text>
              <Pressable
                hitSlop={8}
                accessibilityLabel={`Remove ${f.name}`}
                onPress={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Ionicons name="close-circle" size={16} color={colors.primaryDark} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.row}>
        <Pressable
          onPress={pickFiles}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Attach a file"
          style={({ pressed }) => [styles.attach, pressed && styles.attachPressed]}
        >
          <Ionicons name="attach" size={24} color={colors.primary} />
        </Pressable>

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
          <Ionicons name="send" size={18} color={colors.surface} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  chips: { gap: 8, paddingBottom: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 220,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.primaryLight
  },
  chipText: { flexShrink: 1, fontSize: 12, fontWeight: "600", color: colors.primaryDark },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  attach: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  attachPressed: { backgroundColor: colors.primaryLight },
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
  sendPressed: { backgroundColor: colors.primaryDark }
});