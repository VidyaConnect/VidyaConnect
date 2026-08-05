"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, MessageSquare, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: GraduationCap,
    iconBg: "bg-[#1B3A6B]",
    title: "Academic Excellence",
    description:
      "Track performance, manage assignments, and foster a culture of continuous improvement.",
  },
  {
    icon: MessageSquare,
    iconBg: "bg-teal-400",
    title: "Seamless Communication",
    description:
      "Instant messaging and announcements keeping parents and teachers aligned.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-purple-600",
    title: "Data-Driven Insights",
    description:
      "Comprehensive reports and analytics to guide administrative decisions.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Guides", "Webinars"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security Standards"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="bg-[#1B3A6B] px-8 py-4 flex items-center justify-end">
        <Link
          href="/login"
          className="border border-white/40 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      
      <section className="bg-gradient-to-br from-violet-50 to-purple-50 px-8 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full mb-6">
              BUILDING THE FUTURE OF EDUCATION
            </span>

            <h1 className="text-5xl font-extrabold text-[#1B3A6B] leading-tight mb-6">
              Connecting
              <br />
              Schools, Parents
              <br />
              and Teachers
            </h1>

            <p className="text-slate-600 leading-relaxed mb-8 max-w-md">
              VidyaConnect is an all-in-one educational platform designed to
              streamline communication, enhance learning outcomes, and bring
              the entire academic community together.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/register-school/step-1"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center border border-slate-300 hover:bg-slate-50 text-[#1B3A6B] text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Replace with your actual logo asset */}
            <div className="w-[36rem] h-[36rem] flex items-center justify-center">
                <img
                    src="/images/logo_VidyaConnect.png"
                    alt="VidyaConnect"
                    className="w-full h-full object-contain"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1B3A6B] text-center mb-2">
            Why Choose VidyaConnect?
          </h2>
          <p className="text-slate-600 text-center mb-12">
            Empowering modern education with tools that matter.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1B3A6B] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B3A6B] text-white px-8 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
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
              <Link
                href="#"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Security Standards
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}