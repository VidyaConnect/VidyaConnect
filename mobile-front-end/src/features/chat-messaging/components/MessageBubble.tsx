import { Text, View, StyleSheet } from 'react-native';
import { Message } from '../types/messaging.types';

export function MessageBubble({ message }: { message: Message }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.bubble,
        message.isOwnMessage ? styles.own : styles.other,
      ]}
    >
      <Text style={message.isOwnMessage ? styles.ownText : styles.otherText}>
        {message.content}
      </Text>
      <Text style={styles.meta}>
        {time} {message.isOwnMessage ? `· ${message.status}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  own: {
    backgroundColor: '#1DB954',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  ownText: { color: '#fff' },
  otherText: { color: '#222' },
  meta: { fontSize: 10, color: '#ddd', marginTop: 4, alignSelf: 'flex-end' },
});