import { useCallback, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { getMyChildren, MyChild } from "../../features/children/services/childrenApi";
import { setSelectedChild } from "../../features/children/hooks/selectedChild";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function MyChildrenPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [children, setChildren] = useState<MyChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reloads every time this screen comes into view (e.g. after sending a request)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const data = await getMyChildren();
          if (active) {
            setChildren(data);
            setError("");
          }
        } catch (err: any) {
          console.log("CHILDREN ERROR:", err.response?.status, err.message);
          if (active) {
            setError(
              !err.response
                ? "Cannot reach the server. Check your Wi-Fi and try again."
                : "Could not load your children. Please try again."
            );
          }
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const openDashboard = (child: MyChild) => {
    setSelectedChild({ id: String(child.id), name: child.name ?? "" });
    router.push({
      pathname: "/home",
      params: { studentId: child.id, studentName: child.name ?? "" },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>My Children</Text>
        <Pressable onPress={() => router.push("/children/link")} hitSlop={10}>
          <Ionicons name="person-add-outline" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Linked Children</Text>
        <Text style={styles.sectionSub}>
          Manage profiles for your children enrolled in VidyaConnect platform.
        </Text>

        {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && children.length === 0 ? (
          <Text style={styles.emptyText}>No children linked yet. Tap "Add Another Child" below.</Text>
        ) : null}

        {children.map((child) => {
          const linked = child.status === "LINKED";
          const pending = child.status === "PENDING";
          const rejected = child.status === "REJECTED";

          return (
            <Pressable
              key={`${child.status}-${child.id}`}
              style={[styles.card, linked && styles.cardLinked]}
              onPress={() => {
                if (linked) openDashboard(child);
              }}
            >
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, linked && styles.avatarLinked]}>
                  {linked && child.name ? (
                    <Text style={styles.avatarText}>{initialsOf(child.name)}</Text>
                  ) : (
                    <Ionicons name="person" size={28} color={colors.navy} />
                  )}
                </View>
              </View>

              <View style={styles.info}>
                {linked ? (
                  <>
                    <Text style={styles.name} numberOfLines={1}>
                      {child.name}
                    </Text>
                    {child.grade ? (
                      <View style={styles.gradeChip}>
                        <Text style={styles.gradeText}>{child.grade}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.school}>{child.school}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.name} numberOfLines={1}>
                      {child.school}
                    </Text>
                    <Text style={styles.meta}>
                      Admission No: {child.admissionNumber ?? "-"}
                    </Text>
                    <View
                      style={[
                        styles.statusChip,
                        pending ? styles.pendingChip : styles.rejectedChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          pending ? styles.pendingText : styles.rejectedText,
                        ]}
                      >
                        {pending ? "Pending verification" : "Rejected"}
                      </Text>
                    </View>
                    {rejected && child.rejectReason ? (
                      <Text style={styles.reason}>Reason: {child.rejectReason}</Text>
                    ) : null}
                  </>
                )}
              </View>

              {linked ? (
                <View style={styles.homeLink}>
                  <Text style={styles.homeLinkText}>Home</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </View>
              ) : null}
            </Pressable>
          );
        })}

        <Pressable style={styles.addCard} onPress={() => router.push("/children/link")}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={24} color={colors.text} />
          </View>
          <Text style={styles.addTitle}>Add Another Child</Text>
          <Text style={styles.addSub}>Link a new student to your account</Text>
        </Pressable>

        <View style={styles.helpCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSub}>Contact school administration</Text>
          </View>
          <View style={styles.helpIcon}>
            <Ionicons name="headset-outline" size={22} color="#ffffff" />
          </View>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.header,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  content: { padding: 20, gap: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  sectionSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },
  loader: { marginVertical: 12 },
  errorText: { fontSize: 13, color: "#b3261e", lineHeight: 19 },
  emptyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardLinked: { borderLeftWidth: 5, borderLeftColor: colors.primary },
  avatarWrap: { width: 60, height: 60 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.avatarBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLinked: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.avatarTeal },
  avatarText: { fontSize: 18, fontWeight: "800", color: colors.navy },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: "800", color: colors.text },
  gradeChip: {
    alignSelf: "flex-start",
    backgroundColor: colors.mutedSoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gradeText: { fontSize: 11, fontWeight: "600", color: colors.textSecondary },
  statusChip: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  pendingChip: { backgroundColor: "#fff4d6" },
  pendingText: { color: "#8a5a00" },
  rejectedChip: { backgroundColor: "#fde7e7" },
  rejectedText: { color: "#b3261e" },
  reason: { fontSize: 12, color: "#b3261e", lineHeight: 17 },
  school: { fontSize: 13, color: colors.textSecondary },
  meta: { fontSize: 12, color: colors.textMuted },
  homeLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 2,
  },
  homeLinkText: { fontSize: 14, fontWeight: "700", color: colors.primary },
  addCard: {
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.textMuted,
    borderRadius: 16,
    paddingVertical: 28,
  },
  addCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mutedSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  addSub: { fontSize: 13, color: colors.textSecondary },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 20,
    marginTop: 4,
  },
  helpTitle: { fontSize: 17, fontWeight: "800", color: "#93a8d6" },
  helpSub: { fontSize: 13, color: "#93a8d6", marginTop: 2 },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});