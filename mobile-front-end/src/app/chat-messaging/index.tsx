import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useConversations } from '@/features/chat-messaging/hooks/useConversations';
import { ConversationListItem } from '@/features/chat-messaging/components/ConversationListItem';

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No conversations yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            onPress={() => router.push(`/messages/${item.id}`)}
          />
        )}
      />
    </View>
  );
}