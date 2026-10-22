import { useLocalSearchParams } from "expo-router";
import { ChatThreadScreen } from "../../../features/communication/components/ChatThreadScreen";

export default function MessageThreadRoute() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  return <ChatThreadScreen threadId={threadId ?? "thread-1"} />;
}