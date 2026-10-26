import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  GraduationCap,
  KeyRound,
  School,
  UserPlus,
} from "lucide-react";
import { SignUpForm } from "./SignUpForm";

const STEPS = [
  { icon: UserPlus, title: "Create your account", note: "You are here" },
  { icon: School, title: "Register your school", note: "School details and documents" },
  { icon: ClipboardCheck, title: "Get approved", note: "Then add teachers and students" },
];

/**
 * Brand name, in the same style as the mobile app top bar:
 * extra bold, italic, soft shadow, "Vidya" white + "Connect" light green.
 * Use only on a dark background.
 */
function Wordmark({ size = "lg" }: { size?: "sm" | "lg" }) {
  const textSize = size === "lg" ? "text-4xl xl:text-5xl" : "text-3xl";
  const capSize =
    size === "lg"
      ? "left-[-4px] -top-[26px] w-8 h-8 xl:-top-[32px] xl:w-10 xl:h-10"
      : "left-[-3px] -top-[20px] w-6 h-6";

  return (
    <Link href="/" className="relative inline-block">
      <GraduationCap
        className={`vc-cap absolute text-white ${capSize}`}
        aria-hidden="true"
      />
      <span
        className={`block ${textSize} font-black italic leading-none tracking-wide [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]`}
      >
        <span className="text-white">Vidya</span>
        <span className="text-[#B0E6C9]">Connect</span>
      </span>
    </Link>
  );
}

export function SignUpScreen() {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[5fr_6fr]">
      <style>{`
        @keyframes vc-cap {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-4px) rotate(10deg); }
        }
        @keyframes vc-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
        }
        @keyframes vc-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vc-cap { animation: vc-cap 2.4s ease-in-out infinite; transform-origin: 50% 80%; }
        .vc-blob { animation: vc-blob 14s ease-in-out infinite; }
        .vc-fade-up { opacity: 0; animation: vc-fade-up 0.7s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .vc-cap, .vc-blob { animation: none !important; }
          .vc-fade-up { animation: none !important; opacity: 1; }
        }
      `}</style>

      {/* Mobile top bar */}
      <header className="lg:hidden bg-[#1B3A6B] px-4 py-4 pt-8 flex items-center justify-between">
        <Wordmark size="sm" />
        <Link href="/login" className="text-white text-sm font-semibold border-2 border-white/50 rounded-xl px-4 py-2">
          Sign In
        </Link>
      </header>

      {/* Left brand panel (desktop) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1B3A6B] text-white p-12 xl:p-16">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="vc-blob absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="vc-blob absolute bottom-0 right-0 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl" style={{ animationDelay: "-6s" }} />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative pt-8">
          <Wordmark size="lg" />
        </div>

        <div className="relative max-w-md">
          <h1 className="vc-fade-up text-3xl xl:text-4xl font-extrabold leading-tight mb-4">
            Create your School Admin account
          </h1>
          <p className="vc-fade-up text-slate-200 text-lg mb-10" style={{ animationDelay: "0.1s" }}>
            It takes about two minutes. Next, you&apos;ll register your school.
          </p>

          <ol className="space-y-5">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const active = index === 0;
              return (
                <li
                  key={step.title}
                  className="vc-fade-up flex items-center gap-4"
                  style={{ animationDelay: `${0.2 + index * 0.12}s` }}
                >
                  <span
                    className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${
                      active ? "bg-teal-400 text-[#0b2447]" : "bg-white/10 border border-white/20 text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-bold">
                      {index + 1}. {step.title}
                    </span>
                    <span className={`block text-sm ${active ? "text-teal-200" : "text-slate-300"}`}>
                      {step.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative max-w-md rounded-2xl bg-white/10 border border-white/20 p-5 flex items-start gap-3">
          <KeyRound className="w-6 h-6 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-slate-100 leading-snug">
            <span className="font-bold text-white">Are you a teacher? </span>
            You don&apos;t need to sign up. Sign in with the login details your School Admin gave you.
          </p>
        </div>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-col px-5 sm:px-10 py-8 lg:py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A6B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to home
          </Link>
          <p className="hidden lg:block text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#1B3A6B] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-xl">
            {/* Progress */}
            <div className="mb-6" aria-label="Registration progress">
              <p className="text-xs font-bold tracking-widest text-teal-700 mb-2">STEP 1 OF 3</p>
              <div className="flex gap-2" aria-hidden="true">
                <span className="h-2 flex-1 rounded-full bg-teal-600" />
                <span className="h-2 flex-1 rounded-full bg-slate-200" />
                <span className="h-2 flex-1 rounded-full bg-slate-200" />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-[#1B3A6B] mb-2">Create your account</h2>
            <p className="text-slate-600 mb-8">
              Enter your own details. These will be your login. You&apos;ll add your school&apos;s
              information in the next step.
            </p>

            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  );
}