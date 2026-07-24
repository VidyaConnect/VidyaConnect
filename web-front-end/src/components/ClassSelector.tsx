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
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
    >
      {classes.map((cls) => (
        <option key={cls.id} value={cls.id}>
          {cls.name}
        </option>
      ))}
    </select>
  )
}
