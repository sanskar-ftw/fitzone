import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' }

/** Register page — name, email, password, confirm password */
export default function Register() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to FitZone 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-[#07070b] border ${
      errors[field] ? 'border-red-500' : 'border-white/10'
    } text-white rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors placeholder-gray-500 text-sm`

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle radial space glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black tracking-wider text-white">
            <Dumbbell className="text-white" size={26} />
            <span className="text-white uppercase font-black">FIT ZONE</span>
          </Link>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Create your member account</p>
        </div>

        <div className="card bg-[#0d0d13]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Verma"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="arjun@gmail.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`${inputClass('password')} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={inputClass('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-gray-950 font-bold py-3.5 rounded-full transition-all duration-300 text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Creating Account…' : 'Join FitZone'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline font-semibold ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Live Website */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
            <span>← Back to Live Website</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
