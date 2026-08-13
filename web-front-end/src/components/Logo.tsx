// VidyaConnect Logo - SVG component
export function Logo() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Book symbol */}
      <path d="M 30 20 Q 40 15 50 20 L 50 60 Q 40 55 30 60 Z" fill="#0f3a7d" stroke="#00d4ff" strokeWidth="2"/>
      <path d="M 50 20 Q 60 15 70 20 L 70 60 Q 60 55 50 60 Z" fill="#7c3aed" stroke="#00d4ff" strokeWidth="2"/>
      
      {/* Network nodes */}
      <circle cx="45" cy="25" r="3" fill="#00d4ff"/>
      <circle cx="55" cy="35" r="3" fill="#00d4ff"/>
      <circle cx="50" cy="45" r="3" fill="#00d4ff"/>
      <line x1="45" y1="25" x2="55" y2="35" stroke="#00d4ff" strokeWidth="1"/>
      <line x1="55" y1="35" x2="50" y2="45" stroke="#00d4ff" strokeWidth="1"/>
      
      {/* Text */}
      <text x="85" y="55" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#0f3a7d">
        VidyaConnect
      </text>
    </svg>
  )
}

export function LogoWithText() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16">
        <Logo />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-blue-900">VidyaConnect</h1>
        <p className="text-xs text-blue-600">School Management System</p>
      </div>
    </div>
  )
}
