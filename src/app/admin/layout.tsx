import React from 'react'

// Covers the root layout's Navbar/Footer so admin pages are fully isolated
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-hidden">
      {children}
    </div>
  )
}
