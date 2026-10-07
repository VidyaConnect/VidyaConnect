import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Conversation } from '../types/messaging.types';

interface Props {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationListItem({ conversation, onPress }: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.avatarPlaceholder} />
      <View style={styles.textContainer}>
        <View style={styles.topLine}>
          <Text style={styles.name}>{conversation.participantName}</Text>
          <Text style={styles.time}>{conversation.lastMessageTime}</Text>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
      {conversation.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '600', fontSize: 15 },
  time: { fontSize: 12, color: '#888' },
  preview: { fontSize: 13, color: '#666', marginTop: 2 },
  badge: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});