import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AppHeader, ScreenShell } from "../../../components/layout/AppHeader";
import { colors } from "../../../constants/colors";
import { UserRole } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { TargetAudience, CreateAnnouncementInput, AnnouncementTag } from "../types/announcement";
import { createAnnouncement, saveDraftAnnouncement } from "../services/announcementService";

const MAX_CONTENT_LENGTH = 2000;

const MOCK_CLASSES = ["Class 1-A", "Class 2-B", "Class 3-C", "Class 4-B", "Class 5-A"];

type AudienceMode = "wide" | "specific";

interface AudienceConfig {
  wideLabel: string;
  specificLabel: string;
  wideValue: TargetAudience;
  specificValue: TargetAudience;
}

const AUDIENCE_BY_ROLE: Record<"super-admin" | "school-admin", AudienceConfig> = {
  "super-admin": {
    wideLabel: "Platform-Wide",
    specificLabel: "Specific Schools",
    wideValue: "all-schools",
    specificValue: "specific-entities",
  },
  "school-admin": {
    wideLabel: "School-Wide",
    specificLabel: "Class Selector",
    wideValue: "school-wide",
    specificValue: "class-level",
  },
};

interface PostAnnouncementFormProps {
  role: "super-admin" | "school-admin";
}

export function PostAnnouncementForm({ role }: PostAnnouncementFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const audienceConfig = AUDIENCE_BY_ROLE[role];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<"general" | "important" | null>(null);
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("wide");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [requireParentConfirmation, setRequireParentConfirmation] = useState(false);
  const [schedulePublication, setSchedulePublication] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titlePlaceholder =
    role === "super-admin"
      ? "e.g., Scheduled System Maintenance for Q3 Updates"
      : "e.g., Annual Sports Day Update";

  const resolveTargetAudience = (): TargetAudience =>
    audienceMode === "wide" ? audienceConfig.wideValue : audienceConfig.specificValue;

  const buildInput = (): CreateAnnouncementInput => ({
    title: title.trim(),
    content: content.trim(),
    targetAudience: resolveTargetAudience(),
    requireParentConfirmation: role === "school-admin" ? requireParentConfirmation : false,
    schedulePublication: schedulePublication && scheduledAt.trim() ? scheduledAt.trim() : undefined,
    selectedClass: audienceMode === "specific" && role === "school-admin" ? selectedClass ?? undefined : undefined,
    tag: selectedTag ?? undefined,
  });

  const validate = (): string | null => {
    if (!title.trim()) return "Please enter an announcement title.";
    if (!content.trim()) return "Please enter message content.";
    if (content.length > MAX_CONTENT_LENGTH) return `Message must be ${MAX_CONTENT_LENGTH} characters or fewer.`;
    if (!selectedTag) return "Please choose General or Important before publishing.";
    if (audienceMode === "specific" && role === "school-admin" && !selectedClass) {
      return "Please select a class for Class Selector audience.";
    }
    if (schedulePublication && !scheduledAt.trim()) {
      return "Please enter a scheduled date and time (e.g. 2026-08-15 09:00).";
    }
    return null;
  };

  const getPostedBy = () => ({
    id: user?.id ?? "user-1",
    name: user?.name ?? (role === "super-admin" ? "System Admin" : "School Admin"),
    role: role as UserRole,
  });

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Nothing to save", "Add a title or message before saving a draft.");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveDraftAnnouncement(buildInput(), getPostedBy());
      Alert.alert("Draft saved", "Your announcement draft has been saved.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Cannot publish", error);
      return;
    }

    setIsSubmitting(true);
    try {
      await createAnnouncement(buildInput(), getPostedBy());
      Alert.alert(
        "Published",
        role === "super-admin"
          ? "Your platform-wide announcement has been distributed."
          : "Your announcement has been published to the school.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenShell
      header={
        <AppHeader
          title="Post Announcement"
          showBack
          onBack={() => router.back()}
        />
      }
      footer={
        <View style={styles.footer}>
          <Pressable
            style={[styles.draftBtn, isSubmitting && styles.btnDisabled]}
            onPress={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.publishBtn, isSubmitting && styles.btnDisabled]}
            onPress={handlePublish}
            disabled={isSubmitting}
          >
            <Text style={styles.publishBtnText}>
              {isSubmitting ? "Publishing..." : "Publish Now"}
            </Text>
          </Pressable>
        </View>
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Announcement Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={titlePlaceholder}
              placeholderTextColor={colors.textMuted}
              style={styles.titleInput}
            />

            <Text style={styles.label}>Announcement Type</Text>
            <View style={styles.tagRow}>
              <Pressable
                style={[
                  styles.tagOption,
                  styles.tagGeneral,
                  selectedTag === "general" && styles.tagGeneralActive,
                ]}
                onPress={() => setSelectedTag("general")}
              >
                <FontAwesome
                  name="info-circle"
                  size={14}
                  color={selectedTag === "general" ? colors.surface : colors.success}
                />
                <Text
                  style={[
                    styles.tagOptionText,
                    { color: selectedTag === "general" ? colors.surface : colors.success },
                  ]}
                >
                  General
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tagOption,
                  styles.tagImportant,
                  selectedTag === "important" && styles.tagImportantActive,
                ]}
                onPress={() => setSelectedTag("important")}
              >
                <FontAwesome
                  name="exclamation-circle"
                  size={14}
                  color={selectedTag === "important" ? colors.surface : colors.danger}
                />
                <Text
                  style={[
                    styles.tagOptionText,
                    { color: selectedTag === "important" ? colors.surface : colors.danger },
                  ]}
                >
                  Important
                </Text>
              </Pressable>
            </View>
            <Text style={styles.tagHint}>
              Required to publish. Not required to save as draft.
            </Text>

            <Text style={styles.label}>Target Audience</Text>
            <View style={styles.segmented}>
              <Pressable
                style={[styles.segment, audienceMode === "wide" && styles.segmentActive]}
                onPress={() => setAudienceMode("wide")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    audienceMode === "wide" && styles.segmentTextActive,
                  ]}
                >
                  {audienceConfig.wideLabel}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.segment, audienceMode === "specific" && styles.segmentActive]}
                onPress={() => setAudienceMode("specific")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    audienceMode === "specific" && styles.segmentTextActive,
                  ]}
                >
                  {audienceConfig.specificLabel}
                </Text>
              </Pressable>
            </View>

            {audienceMode === "specific" && role === "school-admin" && (
              <View style={styles.classPicker}>
                <Text style={styles.classPickerLabel}>Select Class</Text>
                <View style={styles.classChipRow}>
                  {MOCK_CLASSES.map((cls) => (
                    <Pressable
                      key={cls}
                      style={[styles.classChip, selectedClass === cls && styles.classChipActive]}
                      onPress={() => setSelectedClass(cls)}
                    >
                      <Text
                        style={[
                          styles.classChipText,
                          selectedClass === cls && styles.classChipTextActive,
                        ]}
                      >
                        {cls}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {audienceMode === "specific" && role === "super-admin" && (
              <View style={styles.hintBox}>
                <FontAwesome name="info-circle" size={14} color={colors.navy} />
                <Text style={styles.hintText}>
                  Specific school selection will be available when the backend is connected.
                </Text>
              </View>
            )}

            <Text style={styles.label}>Message Content</Text>
            <View style={styles.messageBox}>
              <TextInput
                value={content}
                onChangeText={(text) => {
                  if (text.length <= MAX_CONTENT_LENGTH) setContent(text);
                }}
                placeholder="Type your detailed announcement here..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                style={styles.messageInput}
              />
              <View style={styles.messageFooter}>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      "Attachments",
                      "File attachment picker will be wired when storage APIs are ready."
                    )
                  }
                  style={styles.attachmentBtn}
                >
                  <FontAwesome name="paperclip" size={14} color={colors.navy} />
                  <Text style={styles.attachmentText}>Add Attachment</Text>
                </Pressable>
                <Text style={styles.charCount}>
                  {content.length} / {MAX_CONTENT_LENGTH}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {role === "school-admin" && (
              <View style={styles.toggleRow}>
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleTitle}>Require parent confirmation</Text>
                  <Text style={styles.toggleSubtitle}>Parents must acknowledge receipt</Text>
                </View>
                <Switch
                  value={requireParentConfirmation}
                  onValueChange={setRequireParentConfirmation}
                  trackColor={{ false: colors.border, true: colors.navy }}
                  thumbColor={colors.surface}
                />
              </View>
            )}

            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Schedule publication</Text>
                <Text style={styles.toggleSubtitle}>Pick a future date and time</Text>
              </View>
              <Switch
                value={schedulePublication}
                onValueChange={setSchedulePublication}
                trackColor={{ false: colors.border, true: colors.navy }}
                thumbColor={colors.surface}
              />
            </View>

            {schedulePublication && (
              <TextInput
                value={scheduledAt}
                onChangeText={setScheduledAt}
                placeholder="YYYY-MM-DD HH:mm (e.g. 2026-08-15 09:00)"
                placeholderTextColor={colors.textMuted}
                style={styles.scheduleInput}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },

  tagRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  tagOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tagGeneral: {
    borderColor: colors.success,
    backgroundColor: colors.successSoft,
  },
  tagGeneralActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  tagImportant: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  tagImportantActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  tagOptionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  tagHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 16,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.mutedSoft,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.navy,
  },
  classPicker: {
    marginBottom: 16,
  },
  classPickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  classChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  classChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.mutedSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  classChipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  classChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  classChipTextActive: {
    color: colors.surface,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.mutedSoft,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  messageBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  messageInput: {
    minHeight: 140,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    fontSize: 14,
    color: colors.text,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.mutedSoft,
  },
  attachmentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  attachmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.navy,
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  toggleCopy: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.navy,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  scheduleInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 24,
    backgroundColor: colors.background,
    gap: 12,
  },
  draftBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.navy,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  draftBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.navy,
  },
  publishBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: colors.navy,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.surface,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
