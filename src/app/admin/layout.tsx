'use client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="md-surface" style={{
      minHeight: '100vh'
    }}>
      {children}
    </div>
  )
}