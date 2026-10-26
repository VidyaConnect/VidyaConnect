import { RegistrationProvider } from "@/features/school-registration/context/registrationContext";
import OnboardingGuard from "@/features/auth/components/OnboardingGuard";

export default function RegisterSchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationProvider>
      <OnboardingGuard>{children}</OnboardingGuard>
    </RegistrationProvider>
  );
}