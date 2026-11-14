import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell,
  MapPin,
  Mail,
  Phone,
  Share2,
  Twitter,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Footer() {
  const year = new Date().getFullYear()
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/plans', label: 'Membership Plans' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setSubscribed(true)
    toast.success('Thank you for subscribing to FitZone Weekly! 💌')
    setEmailInput('')
  }

  return (
    <footer className="bg-[#050508] border-t border-white/10 text-white">
      {/* ── Main Footer Links & Newsletter ─────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-2xl font-black tracking-wider">
              <Dumbbell className="text-white" size={26} />
              <span className="text-white font-extrabold uppercase">FIT ZONE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Forge your best self with premium gym facilities, Olympic strength platforms, certified personal coaching, and a vibrant community.
            </p>

            <div className="flex gap-2.5 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={15} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Share2 size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="text-gray-500 text-xs">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Hours & Location (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Club Hours & Contact</h4>

            <div className="bg-[#0e0e14]/80 p-4 rounded-2xl border border-white/10 text-xs space-y-2 backdrop-blur-md">
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Monday – Friday:</span>
                <span className="font-bold text-white">05:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Saturday – Sunday:</span>
                <span className="font-bold text-white">06:00 AM – 09:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-gray-300 pt-2 border-t border-white/5">
                <span className="text-gray-400">Location:</span>
                <span className="text-gray-200 font-medium">100 Feet Rd, Indiranagar, Bengaluru</span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Get Weekly Workout Splits & Diet Guides</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-white text-xs font-semibold bg-white/10 border border-white/20 p-2.5 rounded-xl">
                  <CheckCircle2 size={16} className="text-green-400" /> Subscribed to FitZone Weekly!
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-[#101016] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-100 text-gray-950 text-xs py-2.5 px-5 rounded-full font-bold shrink-0 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────── */}
      <div className="border-t border-white/5 py-6 bg-black/60 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {year} FitZone Fitness Club Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Gym Etiquette & Rules</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
