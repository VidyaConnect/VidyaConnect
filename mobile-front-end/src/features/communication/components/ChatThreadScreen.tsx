import { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../constants/colors";
import { useChatThread } from "../hooks/useChatThread";
import { buildChatItems } from "../utils/buildChatItems";
import { ChatListItem } from "../types/communication";
import { ChatHeader } from "./ChatHeader";
import { ChatComposer } from "./ChatComposer";
import { DateSeparator } from "./DateSeparator";
import { MessageBubble } from "./MessageBubble";

export function ChatThreadScreen({ threadId }: { threadId: string }) {
  const router = useRouter();
  const listRef = useRef<FlatList<ChatListItem>>(null);
  const { thread, messages, loading, error, reload, sendMessage, retryMessage } =
    useChatThread(threadId);

  const items = useMemo(() => buildChatItems(messages), [messages]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader
        title={thread?.className ?? "Class Teacher"}
        subtitle={thread ? `${thread.teacherName} · ${thread.availabilityLabel}` : " "}
        onBack={goBack}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={reload} style={styles.retryBtn} accessibilityRole="button">
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>No messages yet. Say hello to your child's teacher!</Text>
          }
          renderItem={({ item }) =>
            item.type === "date" ? (
              <DateSeparator label={item.label} />
            ) : (
              <MessageBubble message={item.message} onRetry={retryMessage} />
            )
          }
        />
      )}

      <ChatComposer onSend={sendMessage} disabled={loading || !!error} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.chatBackground },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexGrow: 1 },
  empty: { textAlign: "center", color: colors.textSecondary, marginTop: 40, fontSize: 14 },
  errorText: { color: colors.danger, fontSize: 15, textAlign: "center" },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary
  },
  retryText: { color: colors.surface, fontWeight: "700" }
});