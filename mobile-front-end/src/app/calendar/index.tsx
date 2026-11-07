import { View } from "react-native";
import { TopBar } from "../../components/layout/TopBar";
import { BottomTabBar } from "../../components/layout/BottomTabBar";
import { CalendarView } from "../../features/calendar/components/CalendarView";
import { colors } from "../../constants/colors";

// TODO: replace with real data from your auth context / API
const PARENT_NAME = "Mrs. Perera";
const UNREAD_NOTIFICATIONS = 2;

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar active="calendar" parentName={PARENT_NAME} unreadCount={UNREAD_NOTIFICATIONS} />
      <CalendarView />
      <BottomTabBar active="calendar" />
    </View>
  );
}