'use client'

import { useRouter } from 'next/navigation'

export default function DashboardSelector() {
  const router = useRouter()

  const roles = [
    {
      id: 'teacher',
      title: 'Teacher Portal',
      user: 'Ms. Sarah Jenkins',
      desc: 'Mark attendance, post assignments, send messages, and track class metrics.',
      color: 'bg-emerald-600 border-emerald-500 hover:bg-emerald-700',
      badge: 'Teacher',
      icon: '🎓',
    },
    {
      id: 'school-admin',
      title: 'School Admin Portal',
      user: 'Principal Henderson',
      desc: 'Manage school attendance, subscriptions, announcements, and school forms.',
      color: 'bg-[#073b78] border-[#0b3c78] hover:bg-[#062f60]',
      badge: 'Admin',
      icon: '🏫',
    },
    {
      id: 'super-admin',
      title: 'Super Admin Portal',
      user: 'Platform Controller',
      desc: 'Command center for real-time educational network monitoring and school registry.',
      color: 'bg-[#1e293b] border-slate-700 hover:bg-slate-800',
      badge: 'Super Admin',
      icon: '🛡️',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#073b78] to-[#1e293b] flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center text-white mb-12">
        <h1 className="text-5xl font-black tracking-tight">VidyaConnect Portal Select</h1>
        <p className="mt-3 text-xl text-slate-300">Choose a dashboard role to experience the interface.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 group"
          >
            <div>
              <div className="text-5xl mb-6">{role.icon}</div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{role.title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  role.id === 'teacher' ? 'bg-emerald-100 text-emerald-800' :
                  role.id === 'school-admin' ? 'bg-blue-100 text-[#073b78]' : 'bg-slate-100 text-slate-800'
                }`}>
                  {role.badge}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 mb-4">Logged in as: {role.user}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">{role.desc}</p>
            </div>

            <button
              onClick={() => router.push(`/dashboard/${role.id}`)}
              className={`w-full text-white font-bold py-4 rounded-2xl text-center shadow-md transition-all ${role.color}`}
            >
              Enter Dashboard
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/')}
        className="mt-12 text-slate-400 hover:text-white font-bold text-sm flex items-center gap-1 transition-colors"
      >
        &larr; Back to Welcome Screen
      </button>
    </div>
  )
}
