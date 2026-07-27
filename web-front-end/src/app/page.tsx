import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">VidyaConnect</h1>
        <p className="text-xl mb-8 text-blue-100">
          Complete School Management & Student Information System
        </p>

        <div className="flex gap-6 justify-center">
          <Link
            href="/attendance"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Admin Attendance Portal
          </Link>
          <Link
            href="/teacher-attendance"
            className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            Teacher Attendance Portal
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold">Student Management</h3>
            <p className="text-sm text-blue-100 mt-2">Track and manage student information</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold">Attendance</h3>
            <p className="text-sm text-blue-100 mt-2">Real-time attendance tracking</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold">Reports</h3>
            <p className="text-sm text-blue-100 mt-2">Comprehensive analytics & insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}
