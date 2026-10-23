// src/features/profile/components/EditProfileModal.tsx
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
import type { UpdateProfilePayload, UserProfile } from "../types/profile.types";

interface Props {
  visible: boolean;
  profile: UserProfile;
  saving: boolean;
  onSave: (payload: UpdateProfilePayload) => void;
  onCancel: () => void;
}

// Same rules as the web profile (the server repeats them)
function validate(fullName: string, phone: string) {
  const errors: { fullName?: string; phone?: string } = {};
  const name = fullName.trim();
  const ph = phone.trim();

  if (!name) errors.fullName = "Full name is required.";
  else if (name.length < 2) errors.fullName = "Full name must be at least 2 characters.";

  if (!ph) errors.phone = "Phone number is required.";
  else if (!/^[+0-9\s()-]+$/.test(ph)) {
    errors.phone = "Use only digits, spaces, +, - and brackets.";
  } else {
    const digits = ph.replace(/\D/g, "").length;
    if (digits < 9 || digits > 15) errors.phone = "Phone number must have 9 to 15 digits.";
  }
  return errors;
}

function findValue(profile: UserProfile, label: string) {
  for (const section of profile.sections) {
    const field = section.fields.find((f) => f.label === label);
    if (field) return field.value;
  }
  return "";
}

export default function EditProfileModal({ visible, profile, saving, onSave, onCancel }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  // Each time the modal opens, start from the current saved values
  useEffect(() => {
    if (visible) {
      setFullName(findValue(profile, "Full Name"));
      setPhone(findValue(profile, "Phone Number"));
      setErrors({});
    }
  }, [visible, profile]);

  const submit = () => {
    if (saving) return;
    const found = validate(fullName, phone);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ fullName: fullName.trim(), phone: phone.trim() });
  };

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
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>Update your name and phone number.</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                if (errors.fullName) setErrors((e) => ({ ...e, fullName: undefined }));
              }}
              maxLength={40}
              editable={!saving}
              placeholder="Full name"
              placeholderTextColor={colors.textMuted}
            />
            {errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
              }}
              maxLength={20}
              keyboardType="phone-pad"
              editable={!saving}
              placeholder="+94 77 123 4567"
              placeholderTextColor={colors.textMuted}
            />
            {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

            <Text style={styles.note}>
              Your email address can’t be changed here.
            </Text>

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
                  <Text style={styles.saveText}>Save Changes</Text>
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
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12, fontWeight: "600", marginTop: 4 },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 12 },
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