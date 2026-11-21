"use client";

import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Lock,
  Megaphone,
  MessageSquare,
  Network,
  School,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

// Friendly, clean font for the hero description
const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

// Header colour. Replace with the `header` value from your mobile app's colors file.
const HEADER_COLOR = "#1B3A6B";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: GraduationCap,
    iconBg: "bg-sky-500",
    title: "Academic Excellence",
    description:
      "Track performance, manage assignments, and foster a culture of continuous improvement.",
  },
  {
    icon: MessageSquare,
    iconBg: "bg-teal-500",
    title: "Seamless Communication",
    description:
      "Instant messaging and announcements keeping parents and teachers aligned.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-purple-500",
    title: "Data-Driven Insights",
    description:
      "Comprehensive reports and analytics to guide administrative decisions.",
  },
  {
    icon: Users,
    iconBg: "bg-emerald-500",
    title: "Teacher & Student Management",
    description:
      "School Admins register teachers and students and keep every record in one place.",
  },
  {
    icon: HeartHandshake,
    iconBg: "bg-pink-500",
    title: "Parent Engagement",
    description:
      "Keep parents informed and involved in their child's academic journey.",
  },
  {
    icon: Lock,
    iconBg: "bg-amber-500",
    title: "Secure Role-Based Access",
    description:
      "Every user sees only what their role allows, from School Admins to Teachers.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up as a School Admin with your name, email and a secure password.",
  },
  {
    icon: School,
    title: "Register your school",
    description:
      "Enter your school's details and upload the required documents.",
  },
  {
    icon: ClipboardCheck,
    title: "Get approved",
    description:
      "Once your school is approved, add your teachers and students.",
  },
];

const HERO_CHIPS = [
  { label: "Announcements", icon: Megaphone, bg: "bg-teal-700", x: 50, y: 4, delay: "-4s" },
  { label: "Calendar", icon: CalendarDays, bg: "bg-sky-500", x: 79.6, y: 14.8, delay: "-1s" },
  { label: "Reports", icon: TrendingUp, bg: "bg-purple-600", x: 95.3, y: 42, delay: "-3s" },
  { label: "Attendance", icon: ClipboardCheck, bg: "bg-emerald-500", x: 89.8, y: 73, delay: "-5s" },
  { label: "Notifications", icon: BellRing, bg: "bg-amber-500", x: 65.7, y: 93.2, delay: "-2s" },
  { label: "Parents", icon: HeartHandshake, bg: "bg-pink-500", x: 34.3, y: 93.2, delay: "-4.5s" },
  { label: "Teachers", icon: Users, bg: "bg-[#1B3A6B]", x: 10.2, y: 73, delay: "-2.5s" },
  { label: "Communities", icon: Network, bg: "bg-indigo-500", x: 4.7, y: 42, delay: "-1.5s" },
  { label: "Messaging", icon: MessageSquare, bg: "bg-teal-500", x: 20.4, y: 14.8, delay: "-3.5s" },
];

const FOOTER_COLUMNS = [
  { title: "Product", links: ["Features", "Pricing", "Integrations"] },
  { title: "Resources", links: ["Help Center", "Guides", "Webinars"] },
  { title: "Company", links: ["About Us", "Careers", "Contact"] },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security Standards"],
  },
];

/* ------------------------------------------------------------------ */
/* Scroll-reveal helper                                                */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`vc-reveal ${visible ? "vc-reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <style>{`
        @keyframes vc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes vc-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-25px, 25px) scale(0.95); }
        }
        @keyframes vc-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes vc-spin-rev {
          to { transform: rotate(-360deg); }
        }
        @keyframes vc-cap {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-4px) rotate(10deg); }
        }
        @keyframes vc-shimmer {
          0% { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(260%) skewX(-20deg); }
        }
        @keyframes vc-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0.45); }
          70% { box-shadow: 0 0 0 16px rgba(15, 118, 110, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0); }
        }
        @keyframes vc-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes vc-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .vc-float { animation: vc-float 6s ease-in-out infinite; }
        .vc-blob { animation: vc-blob 14s ease-in-out infinite; }
        .vc-spin { animation: vc-spin 40s linear infinite; }
        .vc-spin-rev { animation: vc-spin-rev 55s linear infinite; }
        .vc-cap { animation: vc-cap 2.4s ease-in-out infinite; transform-origin: 50% 80%; }
        .vc-pulse { animation: vc-pulse-ring 2.4s ease-out infinite; }
        .vc-hero-in { opacity: 0; animation: vc-fade-up 0.8s ease-out forwards; }
        .vc-gradient-text {
          background-image: linear-gradient(90deg, #0F766E, #1B3A6B, #7c3aed, #0F766E);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: vc-gradient 6s linear infinite;
        }
        .vc-shine { position: relative; overflow: hidden; }
        .vc-shine::after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: vc-shimmer 3.2s ease-in-out infinite;
        }
        .vc-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .vc-reveal-in { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .vc-float, .vc-blob, .vc-spin, .vc-spin-rev, .vc-cap, .vc-pulse,
          .vc-gradient-text, .vc-shine::after { animation: none !important; }
          .vc-hero-in { animation: none !important; opacity: 1; }
          .vc-reveal { opacity: 1; transform: none; transition: none; }
          .vc-gradient-text { color: #0F766E; background: none; }
        }
      `}</style>

      {/* ============================ Header ============================ */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: HEADER_COLOR }}
      >
        {/* Full width so the buttons sit at the right edge */}
        <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="relative mt-4 sm:mt-5 inline-block">
            <GraduationCap
              className="vc-cap absolute left-[-5px] -top-[16px] sm:left-[-6px] sm:-top-[21px] w-6 h-6 sm:w-8 sm:h-8 text-white"
              aria-hidden="true"
            />
            <span className="block text-white text-2xl sm:text-3xl font-extrabold leading-none tracking-tight">
              VidyaConnect
            </span>
          </Link>

          <nav className="flex items-center gap-2.5 sm:gap-4" aria-label="Account">
            <Link
              href="/login"
              className="text-white text-sm sm:text-base font-semibold px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="vc-shine bg-teal-400 hover:bg-teal-300 text-[#0b2447] text-sm sm:text-base font-bold px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ============================= Hero ============================= */}
      <section className="relative bg-gradient-to-b from-white via-white to-slate-50 text-[#1B3A6B]">
        {/* Soft animated accents in the logo's colours */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div className="vc-blob absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-teal-300/25 blur-3xl" />
          <div
            className="vc-blob absolute top-10 right-0 w-[30rem] h-[30rem] rounded-full bg-purple-300/20 blur-3xl"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="vc-blob absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full bg-sky-300/20 blur-3xl"
            style={{ animationDelay: "-9s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1B3A6B 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative w-full px-5 sm:px-8 lg:px-12 xl:px-20 2xl:px-28 pt-14 pb-24 md:pt-20 md:pb-32 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-14 lg:gap-16">
          {/* Copy */}
          <div className="text-left w-full lg:max-w-[40rem] xl:max-w-[44rem]">
            <span
              className="vc-hero-in inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold tracking-wide px-4 py-2 rounded-full mb-6"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              BUILDING THE FUTURE OF EDUCATION
            </span>

            <h1
              className="vc-hero-in text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#1B3A6B] leading-[1.12] mb-6"
              style={{ animationDelay: "0.15s", color: HEADER_COLOR }}
            >
              Connecting Schools, Parents and Teachers
            </h1>

            <p
              className={`vc-hero-in ${bodyFont.className} text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl`}
              style={{ animationDelay: "0.3s" }}
            >
              VidyaConnect is an all-in-one educational platform designed to
              streamline communication, enhance learning outcomes, and bring the
              entire academic community together.
            </p>

            <div
              className="vc-hero-in flex flex-col sm:flex-row sm:items-center gap-4 mb-8"
              style={{ animationDelay: "0.45s" }}
            >
              <Link
                href="/signup"
                className="vc-shine vc-pulse inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-lg font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-teal-700/25"
              >
                Sign Up as School Admin
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#1B3A6B]/30 hover:bg-slate-50 text-[#1B3A6B] text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Who should do what */}
            <div
              className="vc-hero-in grid sm:grid-cols-2 gap-3 max-w-2xl"
              style={{ animationDelay: "0.6s" }}
            >
              <Link
                href="/signup"
                className="group flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-[#1B3A6B] flex items-center justify-center">
                  <School className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block font-bold text-[#1B3A6B]">
                    I&apos;m a new School Admin
                  </span>
                  <span className="block text-sm text-slate-600 mt-1 leading-snug">
                    Create your account first. You&apos;ll register your school right after.
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#1B3A6B] group-hover:gap-2 transition-all">
                    Sign Up as School Admin
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>

              <Link
                href="/login"
                className="group flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-[#1B3A6B] flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-white" aria-hidden="true" />
                </span>
                <span className="block">
                  <span className="block font-bold text-[#1B3A6B]">
                    I&apos;m a teacher
                  </span>
                  <span className="block text-sm text-slate-600 mt-1 leading-snug">
                    No sign up needed. Use the login details from your School
                    Admin.
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#1B3A6B] group-hover:gap-2 transition-all">
                    Sign In
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </div>

            <ul
              className="vc-hero-in mt-6 flex flex-wrap gap-3"
              style={{ animationDelay: "0.75s" }}
            >
              {[
                { icon: ShieldCheck, label: "Secure accounts", tone: "bg-teal-100 text-teal-700" },
                { icon: BadgeCheck, label: "School approval process", tone: "bg-sky-100 text-sky-700" },
                { icon: HeartHandshake, label: "Teachers & parents connected", tone: "bg-purple-100 text-purple-700" },
              ].map(({ icon: Icon, label, tone }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-sm pl-1.5 pr-4 py-1.5 text-sm font-medium text-slate-700"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${tone}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Logo visual */}
          <div className="relative flex justify-center lg:justify-end shrink-0">
            <div className="relative w-80 h-80 sm:w-[26rem] sm:h-[26rem] lg:w-[30rem] lg:h-[30rem] xl:w-[34rem] xl:h-[34rem]">
              {/* Orbit rings */}
              <div
                aria-hidden="true"
                className="vc-spin absolute inset-0 rounded-full border-2 border-dashed border-teal-500/40"
              />
              <div
                aria-hidden="true"
                className="vc-spin-rev absolute inset-6 rounded-full border border-[#1B3A6B]/20"
              />
              {/* Colour glow behind the circle */}
              <div
                aria-hidden="true"
                className="absolute inset-14 rounded-full bg-gradient-to-br from-teal-300/50 via-sky-300/30 to-purple-300/50 blur-3xl"
              />

              {/* Logo circle with gradient ring */}
              <div className="vc-float absolute inset-10 sm:inset-12 rounded-full p-[5px] bg-gradient-to-br from-teal-500 via-[#1B3A6B] to-purple-500 shadow-2xl shadow-[#1B3A6B]/25">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-4 sm:p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo_VidyaConnect.png"
                    alt="VidyaConnect"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Floating chips (icon only on phones, with label from sm up) */}
              {HERO_CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={chip.label}
                    className="absolute"
                    style={{
                      left: `${chip.x}%`,
                      top: `${chip.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className="vc-float flex items-center gap-2 bg-white text-[#1B3A6B] text-xs sm:text-sm font-semibold p-1.5 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl shadow-lg border border-slate-100 whitespace-nowrap"
                      style={{ animationDelay: chip.delay }}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${chip.bg}`}>
                        <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                      </span>
                      <span className="hidden sm:inline">{chip.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-10 sm:h-16 text-white"
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,30 L1440,80 L0,80 Z"
          />
        </svg>
      </section>

      {/* ========================= How it works ========================= */}
      <section className="px-5 sm:px-8 py-20 bg-white" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <span className="text-teal-700 text-xs font-bold tracking-widest">
              FOR NEW SCHOOLS
            </span>
            <h2
              id="how-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#1B3A6B] mt-2 mb-3"
            >
              Get your school started in 3 steps
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Simple for school staff. No technical knowledge needed.
            </p>
          </Reveal>

          <div className="relative grid md:grid-cols-3 gap-6">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-10 left-[16%] right-[16%] border-t-2 border-dashed border-teal-200"
            />
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 120}>
                  <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-7 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1B3A6B] to-teal-600 flex items-center justify-center mb-5 shadow-lg">
                      <Icon className="w-9 h-9 text-white" aria-hidden="true" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-teal-400 text-[#0b2447] text-sm font-extrabold flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#1B3A6B] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="text-center mt-12" delay={200}>
            <Link
              href="/signup"
              className="vc-shine inline-flex items-center gap-2 bg-[#1B3A6B] hover:bg-[#15305a] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              Sign Up as School Admin
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ========================== Two paths ========================== */}
      <section className="px-5 sm:px-8 pb-20 bg-white" aria-labelledby="paths-heading">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2
              id="paths-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#1B3A6B] mb-2"
            >
              Which one are you?
            </h2>
            <p className="text-slate-600">Choose the option that fits you.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="h-full rounded-2xl p-7 bg-gradient-to-br from-teal-50 to-white border border-teal-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                  <School className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1B3A6B] mb-2">
                  New School?
                </h3>
                <p className="text-slate-600 leading-relaxed mb-5">
                  Sign up as a School Admin, then register your school right after.
                  Once it&apos;s approved, you can add your teachers and students.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 hover:gap-3 transition-all"
                >
                  Sign Up as School Admin
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-2xl p-7 bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#1B3A6B] flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1B3A6B] mb-2">
                  Already Have an Account?
                </h3>
                <p className="text-slate-600 leading-relaxed mb-5">
                  School Admins and Teachers can sign in with their existing
                  credentials. Teachers, please use the login details provided
                  by your School Admin.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B] hover:gap-3 transition-all"
                >
                  Go to Sign In
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================= Why choose us ========================= */}
      <section className="relative bg-[#1B3A6B] px-5 sm:px-8 py-24 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="vc-blob absolute -top-20 -left-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
          <div
            className="vc-blob absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl"
            style={{ animationDelay: "-7s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-2">
              Why Choose VidyaConnect?
            </h2>
            <p className="text-slate-300 text-center mb-14">
              Empowering modern education with tools that matter.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={(index % 3) * 120}>
                  <div className="group h-full bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.iconBg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================== Final CTA ========================== */}
      <section className="px-5 sm:px-8 py-20 bg-white">
        <Reveal>
          <div className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3A6B] to-[#0F766E] px-8 py-14 text-center text-white">
            <div
              aria-hidden="true"
              className="vc-blob absolute -top-16 -right-16 w-64 h-64 rounded-full bg-teal-300/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="vc-blob absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-purple-400/25 blur-3xl"
              style={{ animationDelay: "-6s" }}
            />
            <div className="relative">
              <ShieldCheck
                className="w-10 h-10 text-teal-300 mx-auto mb-4"
                aria-hidden="true"
              />
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                Ready to bring your school online?
              </h2>
              <p className="text-slate-200 max-w-xl mx-auto mb-8">
                Create your School Admin account and register your school today.
                Already have an account? Sign in anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/signup"
                  className="vc-shine inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-300 text-[#0b2447] font-bold px-8 py-4 rounded-xl transition-colors"
                >
                  Sign Up as School Admin
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center border border-white/40 hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================ Footer ============================ */}
      <footer className="bg-[#1B3A6B] text-white px-5 sm:px-8 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div>
              <p className="font-bold mb-2">VidyaConnect</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connecting the academic community.
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="font-semibold mb-3">{column.title}</p>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-300">
              © 2024 VidyaConnect Administrative Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                Security Standards
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}