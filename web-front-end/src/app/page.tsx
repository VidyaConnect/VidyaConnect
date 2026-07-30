import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center font-sans p-6">
      <div className="text-center text-white max-w-3xl">
        <h1 className="text-6xl font-black mb-4 tracking-tight">VidyaConnect</h1>
        <p className="text-2xl mb-12 text-blue-100 font-medium">
          Complete School Management & Student Information System
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link
            href="/dashboard"
            className="bg-[#007c6d] text-white px-10 py-4.5 rounded-2xl font-black text-xl hover:bg-[#005f54] shadow-lg hover:scale-105 transition-all text-center min-w-[240px]"
          >
            Enter Dashboards Portal
          </Link>
          <Link
            href="/attendance/school-admin"
            className="bg-white text-indigo-900 px-8 py-4.5 rounded-2xl font-extrabold text-base hover:bg-blue-50 shadow-md hover:scale-105 transition-all text-center min-w-[220px]"
          >
            Admin Attendance
          </Link>
          <Link
            href="/attendance/teacher"
            className="bg-slate-800 text-white border border-slate-700 px-8 py-4.5 rounded-2xl font-extrabold text-base hover:bg-slate-900 shadow-md hover:scale-105 transition-all text-center min-w-[220px]"
          >
            Teacher Attendance
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-extrabold text-lg">Student Management</h3>
            <p className="text-sm text-blue-100/70 mt-2">Track, search, and manage student registry data.</p>
          </div>
          <div className="bg-white bg-opacity-5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-extrabold text-lg">Real-Time Attendance</h3>
            <p className="text-sm text-blue-100/70 mt-2">Track teacher status logs and admin overview metrics.</p>
          </div>
          <div className="bg-white bg-opacity-5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-extrabold text-lg">Reports & Analysis</h3>
            <p className="text-sm text-blue-100/70 mt-2">Generate calendar analyses and export platform reports.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
