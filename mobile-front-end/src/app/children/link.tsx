import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { colors } from "../../constants/colors";
import { submitLinkRequest } from "../../features/children/services/childrenApi";

const RELATIONSHIPS = ["Father", "Mother", "Guardian"] as const;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type PickedFile = { uri: string; name: string; size?: number; mimeType?: string };

export default function LinkChildPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [admissionNo, setAdmissionNo] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [censusNo, setCensusNo] = useState("");
  const [nic, setNic] = useState("");
  const [relationship, setRelationship] = useState<(typeof RELATIONSHIPS)[number]>("Father");
  const [file, setFile] = useState<PickedFile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const acceptFile = (picked: PickedFile) => {
    if (picked.size && picked.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    setError("");
    setFile(picked);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Camera permission is needed to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    acceptFile({
      uri: asset.uri,
      name: asset.fileName ?? "birth-certificate.jpg",
      size: asset.fileSize,
      mimeType: asset.mimeType,
    });
  };

  const chooseFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/jpeg", "image/png", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    acceptFile({
      uri: asset.uri,
      name: asset.name,
      size: asset.size,
      mimeType: asset.mimeType,
    });
  };

  const handleUpload = () => {
    Alert.alert("Supporting document", "How would you like to add it?", [
      { text: "Take a photo", onPress: takePhoto },
      { text: "Choose a file", onPress: chooseFile },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const NIC_REGEX = /^(\d{9}[vVxX]|\d{12})$/;

  const handleSubmit = async () => {
    if (loading) return;
    if (!admissionNo.trim() || !schoolName.trim() || !censusNo.trim()) {
      setError("Please fill in all the child details.");
      return;
    }
    if (!file) {
      setError("Please upload the birth certificate.");
      return;
    }
    if (!NIC_REGEX.test(nic.trim())) {
      setError("Please enter a valid NIC number (e.g. 912345678V or 199112345678).");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await submitLinkRequest({
        admissionNo: admissionNo.trim(),
        schoolName: schoolName.trim(),
        censusNo: censusNo.trim(),
        nic: nic.trim(),
        relationship,
        file,
      });
      Alert.alert("Request sent", "The school will verify your request.", [
        { text: "OK", onPress: () => router.replace("/children") },
      ]);
    } catch (err: any) {
      console.log("LINK ERROR:", err.response?.status, JSON.stringify(err.response?.data), err.message);
      if (err.response?.status === 409) setError("You already sent a request for this child.");
      else if (err.response?.data?.message) setError(err.response.data.message);
      else if (!err.response) setError("Cannot reach the server. Check your Wi-Fi and try again.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Your Child</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Child Details</Text>
          <Text style={styles.subtitle}>
            Please provide the student details to link them to your account.
          </Text>

          <Text style={styles.label}>Child Admission Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="id-card-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. ADM/2023/102"
              placeholderTextColor={colors.textMuted}
              value={admissionNo}
              onChangeText={setAdmissionNo}
              autoCapitalize="characters"
            />
          </View>

          <Text style={styles.label}>School Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="school-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Enter your school name"
              placeholderTextColor={colors.textMuted}
              value={schoolName}
              onChangeText={setSchoolName}
            />
          </View>

          <Text style={styles.label}>School Census Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="card-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Enter School Census No"
              placeholderTextColor={colors.textMuted}
              value={censusNo}
              onChangeText={setCensusNo}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.label}>Parent / Guardian NIC Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="finger-print-outline" size={18} color={colors.textMuted} />
            <TextInput
               style={styles.input}
               placeholder="e.g. 912345678V or 199112345678"
               placeholderTextColor={colors.textMuted}
               value={nic}
               onChangeText={setNic}
               autoCapitalize="characters"
               maxLength={12}
            />
          </View>

          <Text style={styles.label}>Specify your relationship</Text>
          <View style={styles.chipRow}>
            {RELATIONSHIPS.map((item) => {
              const active = item === relationship;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setRelationship(item)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, { marginTop: 28 }]}>Supporting Documents</Text>
          <Text style={styles.help}>
            Please upload a clear photo or scan of the student&apos;s birth certificate for
            verification.
          </Text>

          <Pressable style={styles.uploadBox} onPress={handleUpload}>
            <Ionicons
              name={file ? "document-attach-outline" : "cloud-upload-outline"}
              size={32}
              color={colors.navy}
            />
            <Text style={styles.uploadTitle}>
              {file ? file.name : "Tap to upload or take a photo"}
            </Text>
            <Text style={styles.uploadSub}>
              {file ? "Tap to replace" : "JPG, PNG or PDF (Max 5MB)"}
            </Text>
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton label={loading ? "Sending..." : "Add Child"} onPress={handleSubmit} style={styles.submit} />

          <Text style={styles.note}>
            Link requests are verified by school administration for security.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.header,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "700" },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginTop: 6 },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginTop: 20, marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 14, color: colors.text },
  chipRow: { flexDirection: "row", gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
  chipTextActive: { color: colors.primary },
  help: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  uploadBox: {
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.navy,
    borderRadius: 14,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  uploadTitle: { fontSize: 15, fontWeight: "700", color: colors.navy, textAlign: "center" },
  uploadSub: { fontSize: 12, color: colors.textMuted },
  errorText: { color: colors.danger, fontSize: 13, marginTop: 14 },
  submit: { marginTop: 28, backgroundColor: colors.navy },
  note: { fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 14, lineHeight: 18 },
});