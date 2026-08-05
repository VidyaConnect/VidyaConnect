import { RegistrationProvider } from "@/features/school-registration/context/registrationContext";

export default function RegisterSchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationProvider>
      {children}
    </RegistrationProvider>
  );
}
