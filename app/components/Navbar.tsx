'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Upload,
  ShieldCheck,
  Home,
} from 'lucide-react'

type NavbarProps = {
  isAuthenticated: boolean
  role: string
  fullName: string
}

type NavLink = {
  href: string
  label: string
  icon: React.ReactNode
}

/**
 * Responsive, role-aware navigation bar.
 * Renders different links based on authentication status and user role.
 *
 * @param isAuthenticated - Whether the user has an active session
 * @param role - The user's role from the profiles table
 * @param fullName - The user's display name for the avatar
 */
export function Navbar({ isAuthenticated, role, fullName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navLinks: NavLink[] = []

  if (!isAuthenticated) {
    navLinks.push({ href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> })
  } else {
    navLinks.push({ href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> })
    if (role === 'user') {
      navLinks.push({ href: '/', label: 'Skills', icon: <BookOpen className="w-4 h-4" /> })
    }
    if (role === 'instructor') {
      navLinks.push({ href: '/instructor', label: 'Manage Videos', icon: <Upload className="w-4 h-4" /> })
    }
    if (role === 'admin') {
      navLinks.push({ href: '/admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4" /> })
    }
  }

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="bg-blue-600 text-white rounded-lg p-1.5 px-3 font-bold text-xl tracking-tighter">
            Sovo<span className="text-blue-200">cai</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold"
                title={fullName || 'User'}
              >
                {initials}
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <form action="/auth/signout" method="post" className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
