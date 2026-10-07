import { FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMessages } from '@/features/chat-messaging/hooks/useMessages';
import { MessageBubble } from '@/features/chat-messaging/components/MessageBubble';
import { ChatInput } from '@/features/chat-messaging/components/ChatInput';

export default function ChatThreadScreen() {
  const { conversationId } = useLocalSearchParams();

  if (typeof conversationId !== 'string') {
    return <Text>Invalid conversation ID</Text>;
  }

  const { messages, loading, send } = useMessages(conversationId);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
      <ChatInput onSend={send} />
    </KeyboardAvoidingView>
  );
}