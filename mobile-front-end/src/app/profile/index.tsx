// src/app/profile/index.tsx
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { AppHeader, ScreenShell } from "../../components/layout/AppHeader";
import { BottomTabBar } from "../../components/layout/BottomTabBar";
import { colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile } from "../../features/profile/services/profileService";
import type { UserProfile } from "../../features/profile/types/profile.types";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await getMyProfile());
    } catch {
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/home" as never);
  };

  const comingNext = (title: string) => Alert.alert(title, "This is built in the next step.");

  const confirmLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login" as never);
        },
      },
    ]);
  };

  return (
    <ScreenShell
      header={<AppHeader title="My Profile" showBack onBack={goBack} />}
      tabBar={<BottomTabBar active="more" />}
    >
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Loading profile...</Text>
        </View>
      ) : error || !profile ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? "Profile not available."}</Text>
          <Pressable style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            View and manage your personal information and account settings.
          </Text>

          {/* Header card */}
          <View style={styles.heroCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.avatarInitial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName} numberOfLines={2}>
                {profile.fullName}
              </Text>
              <Text style={styles.heroRole}>{profile.roleTitle}</Text>
            </View>
            <Pressable style={styles.editBtn} onPress={() => comingNext("Edit Profile")}>
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>

          {/* Quick stats */}
          <View style={styles.statsGrid}>
            {profile.quickStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label.toUpperCase()}</Text>
                {stat.isStatus ? (
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>{stat.value}</Text>
                  </View>
                ) : (
                  <Text style={styles.statValue} numberOfLines={2}>
                    {stat.value}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Sections */}
          {profile.sections.map((section) => (
            <View key={section.title} style={styles.card}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              {section.fields.map((field) => (
                <View key={field.label} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Children */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Children</Text>
            {profile.children.length === 0 ? (
              <Text style={styles.muted}>No children linked yet.</Text>
            ) : (
              profile.children.map((child, i) => (
                <View
                  key={child.id}
                  style={[styles.childRow, i < profile.children.length - 1 && styles.childBorder]}
                >
                  <View style={styles.childAvatar}>
                    <Text style={styles.childAvatarText}>{child.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldValue}>{child.name}</Text>
                    <Text style={styles.fieldLabel}>
                      {child.className} • {child.relationship}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Security */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Security Settings</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.fieldValue}>{profile.security.passwordMasked}</Text>
                <Pressable style={styles.outlineBtn} onPress={() => comingNext("Change Password")}>
                  <Text style={styles.outlineBtnText}>Change Password</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Two-Factor Authentication</Text>
              <Text
                style={[
                  styles.fieldValue,
                  { color: profile.security.twoFactorEnabled ? colors.success : colors.textMuted },
                ]}
              >
                {profile.security.twoFactorEnabled ? "Enabled ✓" : "Disabled"}
              </Text>
            </View>
          </View>

          <Text style={styles.updated}>Profile last updated on {profile.lastUpdated}</Text>

          <Pressable style={styles.logoutBtn} onPress={confirmLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </ScrollView>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  muted: { color: colors.textSecondary, fontSize: 14 },
  errorText: { color: colors.danger, fontSize: 15, textAlign: "center" },
  retryBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "700" },

  content: { padding: 16, paddingBottom: 32, gap: 14 },
  subtitle: { color: colors.textSecondary, fontSize: 13 },

  heroCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.avatarBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: colors.navy },
  heroName: { color: "#fff", fontSize: 18, fontWeight: "800" },
  heroRole: { color: "#c5d4e8", fontSize: 13, marginTop: 2 },
  editBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editBtnText: { color: colors.navy, fontWeight: "700", fontSize: 13 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  statLabel: { fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 0.4 },
  statValue: { fontSize: 14, fontWeight: "700", color: colors.text, marginTop: 4 },
  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.successSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  statusText: { color: colors.success, fontWeight: "700", fontSize: 12 },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.navy, marginBottom: 10 },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: colors.textSecondary },
  fieldValue: { fontSize: 15, fontWeight: "600", color: colors.text, marginTop: 2 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  childRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  childBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  childAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.avatarTeal,
    alignItems: "center",
    justifyContent: "center",
  },
  childAvatarText: { fontWeight: "800", color: colors.primary },

  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  outlineBtnText: { fontSize: 12, fontWeight: "700", color: colors.text },

  updated: { fontSize: 12, color: colors.textMuted, textAlign: "center" },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: { color: colors.danger, fontWeight: "800", fontSize: 15 },
});