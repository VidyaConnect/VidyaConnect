// src/features/profile/components/ChangePasswordModal.tsx
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../../../constants/colors";
import type { ChangePasswordPayload } from "../types/profile.types";

interface Props {
  visible: boolean;
  saving: boolean;
  serverError?: string | null;
  onSave: (payload: ChangePasswordPayload) => void;
  onCancel: () => void;
}

export default function ChangePasswordModal({
  visible,
  saving,
  serverError,
  onSave,
  onCancel,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");

  // Empty the fields every time the modal opens
  useEffect(() => {
    if (visible) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
      setError("");
    }
  }, [visible]);

  const submit = () => {
    if (saving) return;
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword.trim().length < 8) {
      setError("New password must be at least 8 characters (spaces alone do not count).");
      return;
    }
    if (newPassword.length > 128) {
      setError("New password must be 128 characters or fewer.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    onSave({ currentPassword, newPassword });
  };

  const shownError = error || serverError || "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !saving && onCancel()}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.backdrop} />
        <View style={styles.card}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Enter your current password and choose a new one.
            </Text>

            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
            />

            <Pressable onPress={() => setShowPasswords((s) => !s)} style={styles.toggle}>
              <Text style={styles.toggleText}>
                {showPasswords ? "Hide passwords" : "Show passwords"}
              </Text>
            </Pressable>

            {shownError ? <Text style={styles.error}>{shownError}</Text> : null}

            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={saving}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={submit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save Password</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", padding: 20 },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.navy },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, marginTop: 10 },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  toggle: { alignSelf: "flex-start", marginTop: 12 },
  toggleText: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  error: { color: colors.danger, fontSize: 13, fontWeight: "600", marginTop: 12 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelText: { fontWeight: "700", color: colors.text },
  saveBtn: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});