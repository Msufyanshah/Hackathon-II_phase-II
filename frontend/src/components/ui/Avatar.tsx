'use client'

interface AvatarProps {
  name: string
  size?: number
  className?: string
}

export default function Avatar({ name, size = 36, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    'from-accent-purple to-accent-cyan',
    'from-accent-emerald to-accent-cyan',
    'from-accent-amber to-accent-rose',
    'from-accent-cyan to-accent-purple',
  ]

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorClass = colors[colorIndex % colors.length]

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}
