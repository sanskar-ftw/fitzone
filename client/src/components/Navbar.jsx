import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useFreePass } from '../context/PassModalContext'
import {
  Menu,
  X,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
  ChevronDown,
  Lock,
} from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { openPassModal } = useFreePass()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const handleOpenPass = () => {
    if (!isAuthenticated) {
      toast('Please log in to claim your free VIP day pass', { icon: '🔒' })
      navigate('/login')
      return
    }
    openPassModal()
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    setMobileOpen(false)
    setUserDropdownOpen(false)
    logout()
  }

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/plans', label: 'Plans' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300 ease-out ${
        scrolled ? 'pt-2.5 pb-2' : 'pt-4 pb-3'
      }`}
    >
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <nav
          className={`backdrop-blur-2xl rounded-full flex items-center justify-between transition-all duration-300 ease-out ${
            scrolled
              ? 'bg-[#08080c]/95 border border-white/20 px-6 sm:px-8 py-2.5 shadow-[0_16px_50px_rgba(0,0,0,0.85)]'
              : 'bg-[#0f0f13]/85 border border-white/10 px-6 sm:px-8 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white font-black tracking-wider text-base sm:text-lg hover:opacity-90 transition-opacity select-none"
          >
            <Dumbbell className="text-white" size={21} />
            <span className="font-extrabold tracking-widest uppercase font-display">FIT ZONE</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-xs sm:text-[13px] font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-white border-b-2 border-white pb-0.5'
                      : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            <button
              onClick={handleOpenPass}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold py-2 px-5 rounded-full transition-all shadow-sm hover:scale-[1.02] whitespace-nowrap cursor-pointer"
            >
              <Sparkles size={13} className="text-white/80 shrink-0" />
              <span>Free Day Pass</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="text-xs text-gray-950 bg-white hover:bg-gray-100 border border-white px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                  >
                    <LayoutDashboard size={13} />
                    <span>Admin Console</span>
                  </NavLink>
                )}

                {/* User badge with Hover Dropdown for Logout */}
                <div
                  className="relative group"
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-full px-3.5 py-1.5 transition-all text-xs font-semibold text-gray-200 hover:text-white cursor-pointer select-none"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[110px] truncate">{user?.name || 'Account'}</span>
                    <ChevronDown
                      size={12}
                      className={`text-gray-400 transition-transform duration-200 ${
                        userDropdownOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full pt-2 transition-all duration-200 z-50 ${
                      userDropdownOpen
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-60 bg-[#0d0d14]/95 border border-white/15 rounded-2xl p-2.5 shadow-2xl backdrop-blur-3xl ring-1 ring-white/10">
                      {/* User Header */}
                      <div className="px-3 py-2.5 border-b border-white/10 mb-1.5">
                        <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded-full border border-white/10">
                            Administrator
                          </span>
                        )}
                      </div>

                      {/* Navigation links */}
                      {!isAdmin && (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <User size={13} className="text-gray-400" />
                          <span>Member Dashboard</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <LayoutDashboard size={13} className="text-gray-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <div className="border-t border-white/10 my-1" />

                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-300 hover:text-white px-3.5 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-white text-gray-950 hover:bg-gray-100 py-2 px-5 rounded-full transition-all shadow-sm hover:scale-[1.02] whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="lg:hidden text-gray-300 hover:text-white p-1.5 focus:outline-none cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="mt-2 lg:hidden bg-[#0f0f13]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 pointer-events-auto">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-1.5 px-2 rounded-lg transition-colors ${
                    isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              onClick={() => {
                setMobileOpen(false)
                handleOpenPass()
              }}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition"
            >
              <Sparkles size={14} /> Free Day Pass
            </button>

            <div className="border-t border-white/10 pt-3 mt-1">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400">Signed in as {user?.name}</span>
                  {!isAdmin && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-200 hover:text-white py-1"
                    >
                      Member Dashboard
                    </NavLink>
                  )}
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-white font-semibold py-1 flex items-center gap-1.5"
                    >
                      <LayoutDashboard size={14} />
                      <span>Admin Console</span>
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium pt-1"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 border border-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl text-xs font-bold text-gray-950 bg-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
