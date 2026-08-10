import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AppHeader, ScreenShell } from "../../../components/layout/AppHeader";
import { BottomTabBar } from "../../../components/layout/BottomTabBar";
import { InitialsAvatar } from "../../../components/ui/InitialsAvatar";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { colors } from "../../../constants/colors";
import { parentAbsenceMock } from "../data/mockAttendance";

export function ParentAbsenceResponseScreen() {
  const router = useRouter();
  const alert = parentAbsenceMock;
  const [reason, setReason] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const firstName = alert.studentName.split(" ")[0];

  const submit = () => {
    if (!reason.trim()) {
      Alert.alert("Reason required", "Please provide a reason for the absence.");
      return;
    }
    Alert.alert(
      "Reason submitted",
      attachedFile
        ? `Submitted with document: ${attachedFile}`
        : "Absence reason submitted successfully."
    );
  };

  return (
    <ScreenShell
      header={
        <AppHeader
          title="VidyaConnect"
          showBack
          onBack={() => router.back()}
        />
      }
      tabBar={<BottomTabBar active="more" />}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {showAlert ? (
          <View style={styles.alertCard}>
            <View style={styles.alertAccent} />
            <View style={styles.alertBody}>
              <View style={styles.alertTop}>
                <View style={styles.alertIconWrap}>
                  <FontAwesome name="calendar" size={16} color={colors.danger} />
                </View>
                <Text style={styles.alertMeta}>
                  Attendance Alert • {alert.alertTime}
                </Text>
                <Pressable onPress={() => setShowAlert(false)} hitSlop={10}>
                  <FontAwesome name="times" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              <Text style={styles.alertTitle}>
                {firstName} was marked Absent today
              </Text>
              <Text style={styles.alertSub}>
                {alert.className} • {alert.dateLabel}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.responseCard}>
          <Text style={styles.sectionTitle}>Attendance Response</Text>
          <Text style={styles.fieldLabel}>Provide a reason</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder={`Please describe why ${firstName} is absent today...`}
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Pressable
            style={styles.uploadBox}
            onPress={() => setAttachedFile("medical-certificate.pdf")}
          >
            <FontAwesome name="paperclip" size={20} color={colors.textSecondary} />
            <Text style={styles.uploadText}>
              {attachedFile ?? "Attach Medical Certificate"}
            </Text>
          </Pressable>
          <Text style={styles.uploadHint}>Optional: Upload PDF or Image (Max 5MB)</Text>

          <PrimaryButton
            label="Submit Reason"
            pill
            onPress={submit}
            style={styles.submitBtn}
          />
          <Pressable onPress={() => Alert.alert("History", "Absence history coming soon.")}>
            <Text style={styles.historyLink}>View History</Text>
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <InitialsAvatar name={alert.studentName} size={52} index={2} />
          <View>
            <Text style={styles.profileName}>{alert.studentName}</Text>
            <Text style={styles.profileMeta}>
              Class 4-B • Roll No: {alert.rollNumber}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 28
  },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    flexDirection: "row"
  },
  alertAccent: {
    width: 5,
    backgroundColor: colors.danger
  },
  alertBody: {
    flex: 1,
    padding: 14,
    gap: 6
  },
  alertTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  alertIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  alertMeta: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.navy,
    marginTop: 2
  },
  alertSub: {
    fontSize: 13,
    color: colors.textSecondary
  },
  responseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
    marginBottom: 4
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.navy
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface
  },
  uploadBox: {
    marginTop: 4,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fafbfc"
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary
  },
  uploadHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: -2
  },
  submitBtn: {
    marginTop: 8
  },
  historyLink: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 2
  },
  profileCard: {
    backgroundColor: colors.profileCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  profileName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.navy
  },
  profileMeta: {
    marginTop: 3,
    fontSize: 13,
    color: colors.textSecondary
  }
});
