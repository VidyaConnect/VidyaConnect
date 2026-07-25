interface ClassSelectorProps {
  selectedClass: string
  onChange: (classId: string) => void
}

export default function ClassSelector({ selectedClass, onChange }: ClassSelectorProps) {
  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: '1a', name: 'Grade 1A' },
    { id: '2b', name: 'Grade 2B' },
    { id: '3c', name: 'Grade 3C' },
    { id: '5a', name: 'Grade 5A' },
    { id: '8a', name: 'Grade 8A' },
  ]

  return (
    <select
      value={selectedClass}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-[#c9ced9] bg-white px-3 text-sm font-normal text-[#25272c] outline-none focus:border-[#9fa8b8]"
    >
      {classes.map((cls) => (
        <option key={cls.id} value={cls.id}>
          {cls.name}
        </option>
      ))}
    </select>
  )
}
