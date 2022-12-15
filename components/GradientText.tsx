export function GradientText({
  children,
  start,
  stop,
}: {
  start: string
  stop: string
  children: string
}) {
  return (
    <span
      className='text-transparent'
      style={{
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        backgroundImage: `linear-gradient(90deg, ${start}, ${stop})`,
      }}
    >
      {children}
    </span>
  )
}
