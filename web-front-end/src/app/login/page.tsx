// src/app/login/page.tsx
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-teal-500 flex items-center justify-center text-white font-bold">
          VC
        </div>
        <h1 className="text-2xl font-bold text-blue-900">VidyaConnect</h1>
        <p className="text-sm text-gray-500">Connecting Schools, Parents and Teachers</p>
      </div>

      <LoginForm />

      <div className="mt-6 flex gap-6 text-sm text-gray-500">
        <a href="#" className="hover:underline">Help Center</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div>
    </main>
  );
}
