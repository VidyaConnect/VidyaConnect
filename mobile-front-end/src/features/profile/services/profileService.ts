// src/features/profile/services/profileService.ts
import { apiClient } from "../../../services/api";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UserProfile,
} from "../types/profile.types";

// While true, the app uses the mock data below and never calls the backend.
// Set it to false once the backend is ready and EXPO_PUBLIC_API_BASE_URL is set.
const USE_MOCK = false;

let mockProfile: UserProfile = {
  id: "PAR-0001",
  fullName: "Rashmi Perera",
  roleTitle: "Parent / Guardian",
  avatarInitial: "R",
  quickStats: [
    { label: "Parent ID", value: "PAR-0001" },
    { label: "Email", value: "rashmi.perera@email.com" },
    { label: "Phone", value: "+94 77 123 4567" },
    { label: "Status", value: "Active", isStatus: true },
  ],
  sections: [
    {
      title: "Personal Information",
      fields: [{ label: "Full Name", value: "Rashmi Perera", editable: true }],
    },
    {
      title: "Contact Information",
      fields: [
        { label: "Email Address", value: "rashmi.perera@email.com" },
        { label: "Phone Number", value: "+94 77 123 4567", editable: true },
      ],
    },
    {
      title: "Account Details",
      fields: [
        { label: "Account Created", value: "January 10, 2026 • 10:24 AM" },
        { label: "Last Login", value: "Not available" },
      ],
    },
  ],
  children: [
    { id: "c1", name: "Tharushi Perera", className: "Grade 10 A", relationship: "Mother" },
    { id: "c2", name: "Nethmi Perera", className: "Grade 6 B", relationship: "Mother" },
  ],
  security: { passwordMasked: "••••••••", twoFactorEnabled: false },
  lastUpdated: "October 19, 2026 • 6:12 PM",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMyProfile(): Promise<UserProfile> {
  if (USE_MOCK) {
    await wait(400);
    return mockProfile;
  }
  const res = await apiClient.get("/profile/me");
  return res.data.data;
}

export async function updateMyProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  if (USE_MOCK) {
    await wait(400);
    mockProfile = {
      ...mockProfile,
      fullName: payload.fullName,
      avatarInitial: payload.fullName.charAt(0).toUpperCase(),
      quickStats: mockProfile.quickStats.map((s) =>
        s.label === "Phone" ? { ...s, value: payload.phone } : s
      ),
      sections: mockProfile.sections.map((section) => ({
        ...section,
        fields: section.fields.map((f) => {
          if (f.label === "Full Name") return { ...f, value: payload.fullName };
          if (f.label === "Phone Number") return { ...f, value: payload.phone };
          return f;
        }),
      })),
    };
    return mockProfile;
  }
  const res = await apiClient.put("/profile/me", payload);
  return res.data.data;
}

export async function changeMyPassword(payload: ChangePasswordPayload): Promise<void> {
  if (USE_MOCK) {
    await wait(400);
    return; // nothing is checked or stored in mock mode
  }
  await apiClient.put("/profile/change-password", payload);
}