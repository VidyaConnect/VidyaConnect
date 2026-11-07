// src/app/login/page.tsx
import Image from "next/image";
import LoginForm from "@/features/auth/components/LoginForm";
import {
  Megaphone,
  FileCheck,
  ClipboardCheck,
  CalendarDays,
  MessagesSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Megaphone,
    title: "School-wide announcements",
    description:
      "Broadcast critical updates to all stakeholders instantly with multi-channel delivery and receipt tracking.",
  },
  {
    icon: FileCheck,
    title: "Digital consent forms",
    description:
      "Secure, paperless permission slips and legal documentation with integrated e-signature support and audit logs.",
  },
  {
    icon: ClipboardCheck,
    title: "Real-time attendance tracking",
    description:
      "Automated attendance logging with instant smart notifications sent to parents for unexplained absences.",
  },
  {
    icon: CalendarDays,
    title: "Calendar & events",
    description:
      "Keep everyone aligned with a shared academic calendar covering exams, holidays, parent meetings, and school events.",
  },
  {
    icon: MessagesSquare,
    title: "Community chat hub",
    description:
      "A dedicated space for teachers, parents, and staff to message directly, share updates, and stay connected in real time.",
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Login Form */}
      <main className="w-full md:w-[45%] md:shrink-0 bg-surface-container-lowest flex flex-col px-8 md:px-16 lg:px-20 py-12 relative z-10">
        <div className="flex justify-center">
          <div className="relative h-100 w-100">
            <div className="flex justify-center">
              <Image
                src="/images/logo_VidyaConnect.png"
                alt="VidyaConnect logo"
                width={240}
                height={240}
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <header className="mb-10 text-center">
              <p className="font-display-lg text-on-surface-variant text-lg">Sign in to VidyaConnect Web Portal</p>
            </header>

            <LoginForm />

            <footer className="mt-12 text-left">
              <p className="text-sm text-on-surface-variant">
                Don&apos;t have an account?{" "}
    
                <a href="/register-school/step-1"
                  className="text-primary font-semibold hover:underline"
                >
                Sign up
                </a>
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Right Side: Visual Panel */}
      <aside className="hidden md:flex md:flex-1 relative overflow-hidden flex-col justify-center p-10 lg:p-20 text-white bg-primary">
      <div className="absolute inset-0 z-0">
    <Image
      src="/images/hero-login.jpg"
      alt="Team collaborating"
      fill
      sizes="55vw"
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
  </div>

        <div className="relative z-10 max-w-xl">
          <h3 className="font-display-lg text-3xl md:text-4xl leading-tight mb-16 tracking-tight">
            Connecting Schools, Parents and Teachers
          </h3>
          <div className="space-y-12">
  {features.map((f) => {
    const Icon = f.icon;

    return (
      <div key={f.title} className="flex items-start gap-6">
        <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
          <Icon className="w-7 h-7 text-white" />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2 text-white">
            {f.title}
          </h4>

          <p className="text-sm text-white/50 leading-relaxed">
            {f.description}
          </p>
        </div>
      </div>
    );
  })}
</div>
        </div>
      </aside>
    </div>
  );
}