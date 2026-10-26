import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";
import { ApiEvent, EventType, fetchEvents } from "../services/calendarService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---------- Colors ----------
const TEAL = "#0B6B5D";
const TEAL_SOFT = "#D3F5EE";
const NAVY = "#0B2A5B";
const NAVY_SOFT = "#DCE4F5";
const ORANGE = "#F59E0B";
const ORANGE_SOFT = "#FFF1DC";
const ORANGE_DARK = "#B45309";
const RED = "#DC2626";
const RED_SOFT = "#FEE2E2";
const PURPLE = "#7C3AED";
const PURPLE_SOFT = "#EDE9FE";
const GRID = "#E8EDF5";

// ---------- Event kinds (grouped from backend types) ----------
type EventKind = "sports" | "academic" | "meeting" | "holiday" | "system";

const TYPE_TO_KIND: Record<EventType, EventKind> = {
  event: "sports",
  trip: "sports",
  exam: "academic",
  deadline: "academic",
  meeting: "meeting",
  holiday: "holiday",
  maintenance: "system",
  update: "system",
  training: "system",
};

const KIND_STYLE: Record<EventKind, { main: string; soft: string; text: string }> = {
  sports: { main: NAVY, soft: NAVY_SOFT, text: NAVY },
  academic: { main: TEAL, soft: TEAL_SOFT, text: TEAL },
  meeting: { main: ORANGE, soft: ORANGE_SOFT, text: ORANGE_DARK },
  holiday: { main: RED, soft: RED_SOFT, text: RED },
  system: { main: PURPLE, soft: PURPLE_SOFT, text: PURPLE },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_LABEL: Record<EventType, string> = {
  holiday: "Holiday",
  exam: "Exam",
  meeting: "Meeting",
  event: "Event",
  deadline: "Deadline",
  trip: "Trip",
  maintenance: "Maintenance",
  update: "System Update",
  training: "Training",
};

// ---------- Event shape used by the UI ----------
type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  description: string;
  details: string;
  location: string;
  time: string;
  kind: EventKind;
  typeLabel: string;
  start: Date;
  end: Date;
};

const fmtTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function timeText(e: ApiEvent, start: Date, end: Date): string {
  if (e.allDay) return "All day";
  if (e.type === "deadline") return `Due ${fmtTime(end)}`;
  return `${fmtTime(start)} – ${fmtTime(end)}`;
}

// One UI event per day the API event covers in the viewed month
function expandForMonth(e: ApiEvent, year: number, month: number): CalendarEvent[] {
  const start = new Date(e.start);
  const end = new Date(e.end);
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

  const first = start < monthStart ? monthStart : start;
  const last = end > monthEnd ? monthEnd : end;

  const out: CalendarEvent[] = [];
  const cur = new Date(first.getFullYear(), first.getMonth(), first.getDate());
  while (cur <= last) {
    out.push({
      id: `${e.id}-${cur.getDate()}`,
      day: cur.getDate(),
      title: e.title,
      description: e.description || TYPE_LABEL[e.type],
      details: e.description || "No extra details for this event.",
      location: e.location || "Not specified",
      time: timeText(e, start, end),
      kind: TYPE_TO_KIND[e.type],
      typeLabel: TYPE_LABEL[e.type],
      start,
      end,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

type Cell = { day: number; inMonth: boolean };

function buildCells(year: number, month: number): Cell[] {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: Cell[] = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: prevDays - startOffset + 1 + i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true });
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, inMonth: false });
  }
  return cells;
}

export function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  // Load events whenever the month changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const from = new Date(year, month, 1, 0, 0, 0);
    const to = new Date(year, month + 1, 0, 23, 59, 59);

    fetchEvents(from, to)
      .then((data) => {
        if (!cancelled) setApiEvents(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Could not load events");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, month, reloadKey]);

  const cells = useMemo(() => buildCells(year, month), [year, month]);

  const monthEvents = useMemo(
    () =>
      apiEvents
        .flatMap((e) => expandForMonth(e, year, month))
        .sort((a, b) => a.day - b.day || a.start.getTime() - b.start.getTime()),
    [apiEvents, year, month]
  );

  const visibleEvents =
    selectedDay === null ? monthEvents : monthEvents.filter((e) => e.day === selectedDay);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const fadeGrid = () => {
    fade.setValue(0.25);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  };

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    fadeGrid();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelectedDay(null);
  };

  const goToday = () => {
    fadeGrid();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const selectDay = (day: number | null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDay(day);
  };

  const openEvent = (e: CalendarEvent) => {
    setActiveEvent(e);
    setModalVisible(true);
  };

  const closeEvent = () => setModalVisible(false);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const monthShort = MONTHS[month].slice(0, 3).toUpperCase();

  const fullDate = (day: number) => {
    const weekday = WEEKDAYS_FULL[new Date(year, month, day).getDay()];
    return `${weekday}, ${day} ${MONTHS[month]} ${year}`;
  };

  const activeStyle = activeEvent ? KIND_STYLE[activeEvent.kind] : KIND_STYLE.academic;
  const eventCount = new Set(monthEvents.map((e) => e.id.split("-")[0])).size;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.monthTitle}>{MONTHS[month]}</Text>
              <Text style={styles.monthSub}>
                {year} · {eventCount} {eventCount === 1 ? "event" : "events"}
              </Text>
            </View>
            <Pressable style={styles.todayBtn} onPress={goToday} hitSlop={6}>
              <Text style={styles.todayBtnText}>Today</Text>
            </Pressable>
            <Pressable style={styles.navBtn} onPress={() => changeMonth(-1)} hitSlop={6}>
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </Pressable>
            <Pressable style={styles.navBtn} onPress={() => changeMonth(1)} hitSlop={6}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w, i) => (
              <View key={w} style={[styles.weekdayCell, i === 6 && styles.noRightBorder]}>
                <Text style={[styles.weekdayText, (i === 0 || i === 6) && styles.weekendText]}>
                  {w}
                </Text>
              </View>
            ))}
          </View>

          <Animated.View style={{ opacity: fade }}>
            {weeks.map((week, wi) => (
              <View key={wi} style={styles.weekRow}>
                {week.map((cell, ci) => {
                  const dayEvents = cell.inMonth
                    ? monthEvents.filter((e) => e.day === cell.day)
                    : [];
                  const selected = cell.inMonth && selectedDay === cell.day;
                  const todayCell = cell.inMonth && isToday(cell.day);
                  const weekend = ci === 0 || ci === 6;
                  const lastRow = wi === weeks.length - 1;

                  return (
                    <Pressable
                      key={ci}
                      disabled={!cell.inMonth}
                      onPress={() => selectDay(selectedDay === cell.day ? null : cell.day)}
                      style={[
                        styles.cell,
                        !cell.inMonth && styles.cellOut,
                        ci === 6 && styles.noRightBorder,
                        lastRow && styles.noBottomBorder,
                      ]}
                    >
                      {selected ? <View pointerEvents="none" style={styles.selectedInner} /> : null}

                      <View style={[styles.numCircle, todayCell && styles.numCircleToday]}>
                        <Text
                          style={[
                            styles.cellText,
                            weekend && styles.cellTextWeekend,
                            !cell.inMonth && styles.cellTextMuted,
                            selected && styles.cellTextSelected,
                            todayCell && styles.cellTextToday,
                          ]}
                        >
                          {cell.day}
                        </Text>
                      </View>

                      <View style={styles.dotRow}>
                        {dayEvents.slice(0, 3).map((e) => (
                          <View
                            key={e.id}
                            style={[styles.dot, { backgroundColor: KIND_STYLE[e.kind].main }]}
                          />
                        ))}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </Animated.View>
        </View>

        <View style={styles.legendRow}>
          <LegendItem color={NAVY} label="Events" />
          <LegendItem color={TEAL} label="Academic" />
          <LegendItem color={ORANGE} label="Meetings" />
          <LegendItem color={RED} label="Holidays" />
          <LegendItem color={PURPLE} label="System" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedDay === null
              ? "Upcoming Events"
              : `Events on ${selectedDay} ${MONTHS[month].slice(0, 3)}`}
          </Text>
          {selectedDay !== null ? (
            <Pressable onPress={() => selectDay(null)} hitSlop={8}>
              <Text style={styles.clearText}>Show all</Text>
            </Pressable>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={TEAL} />
            <Text style={styles.emptyText}>Loading events…</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable onPress={reload} hitSlop={8}>
              <Text style={styles.clearText}>Try again</Text>
            </Pressable>
          </View>
        ) : visibleEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>No events on this day</Text>
          </View>
        ) : (
          visibleEvents.map((e) => {
            const k = KIND_STYLE[e.kind];
            return (
              <Pressable key={e.id} style={styles.eventCard} onPress={() => openEvent(e)}>
                <View style={[styles.dateBadge, { backgroundColor: k.soft }]}>
                  <Text style={[styles.dateDay, { color: k.text }]}>{e.day}</Text>
                  <Text style={[styles.dateMonth, { color: k.text }]}>{monthShort}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.eventTitleRow}>
                    <View style={[styles.eventDot, { backgroundColor: k.main }]} />
                    <Text style={[styles.eventTitle, { color: k.text }]} numberOfLines={1}>
                      {e.title}
                    </Text>
                  </View>
                  <Text style={styles.eventDesc} numberOfLines={2}>
                    {e.description}
                  </Text>
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.timeText}>{e.time}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            );
          })
        )}

        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </View>
          <Text style={styles.bannerTitle}>Never miss a deadline</Text>
          <Text style={styles.bannerSub}>
            Sync your school calendar with your personal devices for real-time notifications.
          </Text>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={reload}>
        <Ionicons name="sync-outline" size={24} color="#fff" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEvent}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={closeEvent} />

          {activeEvent ? (
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetTop}>
                <View style={[styles.kindPill, { backgroundColor: activeStyle.soft }]}>
                  <View style={[styles.kindDot, { backgroundColor: activeStyle.main }]} />
                  <Text style={[styles.kindText, { color: activeStyle.text }]}>
                    {activeEvent.typeLabel}
                  </Text>
                </View>
                <Pressable style={styles.closeBtn} onPress={closeEvent} hitSlop={10}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </Pressable>
              </View>

              <Text style={styles.sheetTitle}>{activeEvent.title}</Text>

              <View style={styles.infoCard}>
                <InfoRow
                  icon="calendar-outline"
                  color={activeStyle.main}
                  bg={activeStyle.soft}
                  label="Date"
                  value={fullDate(activeEvent.day)}
                />
                <InfoRow
                  icon="time-outline"
                  color={activeStyle.main}
                  bg={activeStyle.soft}
                  label="Time"
                  value={activeEvent.time}
                />
                <InfoRow
                  icon="location-outline"
                  color={activeStyle.main}
                  bg={activeStyle.soft}
                  label="Location"
                  value={activeEvent.location}
                  last
                />
              </View>

              <Text style={styles.aboutTitle}>About this event</Text>
              <Text style={styles.aboutText}>{activeEvent.details}</Text>

              <Pressable
                style={[styles.primaryBtn, { backgroundColor: activeStyle.main }]}
                onPress={closeEvent}
              >
                <Text style={styles.primaryBtnText}>Close</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  color,
  bg,
  label,
  value,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  bg: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <View style={[styles.infoIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },

  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GRID,
    ...shadow,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: NAVY,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  monthTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  monthSub: { fontSize: 13, color: "#B8C7E6", marginTop: 2, fontWeight: "600" },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  todayBtn: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    backgroundColor: TEAL_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  todayBtnText: { color: TEAL, fontSize: 13, fontWeight: "800" },

  weekdayRow: {
    flexDirection: "row",
    backgroundColor: "#F3F6FB",
    borderBottomWidth: 1,
    borderBottomColor: GRID,
  },
  weekdayCell: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: GRID,
  },
  weekdayText: { fontSize: 12, fontWeight: "800", color: colors.textSecondary, letterSpacing: 0.3 },
  weekendText: { color: "#E07B7B" },
  weekRow: { flexDirection: "row" },
  cell: {
    flex: 1,
    aspectRatio: 0.92,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: GRID,
    backgroundColor: "#fff",
  },
  cellOut: { backgroundColor: "#F8FAFC" },
  noRightBorder: { borderRightWidth: 0 },
  noBottomBorder: { borderBottomWidth: 0 },
  selectedInner: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#374151",
  },
  numCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  numCircleToday: { backgroundColor: TEAL },
  cellText: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cellTextWeekend: { color: "#C25A5A" },
  cellTextMuted: { color: "#C4C9D4", fontWeight: "500" },
  cellTextSelected: { color: "#374151", fontWeight: "800" },
  cellTextToday: { color: "#fff", fontWeight: "800" },
  dotRow: { flexDirection: "row", gap: 3, height: 6, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: 3 },

  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 14,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textSecondary, fontWeight: "600" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  clearText: { fontSize: 13, fontWeight: "700", color: TEAL },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    ...shadow,
  },
  dateBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: { fontSize: 18, fontWeight: "800" },
  dateMonth: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  eventTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eventDot: { width: 8, height: 8, borderRadius: 4 },
  eventTitle: { fontSize: 16, fontWeight: "800", flexShrink: 1 },
  eventDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  timeText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 8,
    ...shadow,
  },
  emptyText: { fontSize: 14, color: colors.textMuted, fontWeight: "600", textAlign: "center" },

  banner: {
    backgroundColor: NAVY,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  bannerSub: { color: "#C9D6F0", fontSize: 14, marginTop: 6, lineHeight: 20 },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(8,20,45,0.55)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D5DBE7",
    marginBottom: 14,
  },
  sheetTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kindPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  kindDot: { width: 8, height: 8, borderRadius: 4 },
  kindText: { fontSize: 12, fontWeight: "800" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F4F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginTop: 14,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#F8FAFD",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRID,
    paddingHorizontal: 14,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: GRID },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 0.4 },
  infoValue: { fontSize: 15, fontWeight: "700", color: "#111827", marginTop: 1 },
  aboutTitle: { fontSize: 15, fontWeight: "800", color: "#111827", marginTop: 18 },
  aboutText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginTop: 6 },
  primaryBtn: {
    marginTop: 22,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});