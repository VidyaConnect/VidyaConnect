import type { Metadata } from "next";
import { SignUpScreen } from "@/features/auth/components/SignUpScreen";

export const metadata: Metadata = {
  title: "Sign Up as School Admin | VidyaConnect",
};

export default function SignUpPage() {
  return <SignUpScreen />;
}
