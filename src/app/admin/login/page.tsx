'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Kullanıcı adı ve şifre gerekli')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Giriş başarılı')
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Giriş başarısız')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f8f5f0' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo / Başlık */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#3d2c1e] flex items-center justify-center mb-4 shadow-lg">
            <img
              src="/birerteks-logo.png"
              alt="Birer Tekstil"
              className="h-10 w-10 object-contain brightness-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#3d2c1e]">Yönetici Girişi</h1>
          <p className="text-sm text-[#8b7355] mt-1">Birer Tekstil Admin Paneli</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d4] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Kullanıcı adı */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3d2c1e]">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a67c52]" />
                <input
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="kullanıcı adınız"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e0d4] bg-[#f8f5f0] text-[#3d2c1e] text-sm placeholder:text-[#c4b49a] focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 focus:border-[#a67c52] transition"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#3d2c1e]">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a67c52]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8e0d4] bg-[#f8f5f0] text-[#3d2c1e] text-sm placeholder:text-[#c4b49a] focus:outline-none focus:ring-2 focus:ring-[#a67c52]/30 focus:border-[#a67c52] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a67c52] hover:text-[#3d2c1e] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Giriş butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#a67c52] text-white font-semibold text-sm hover:bg-[#a67c52]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#c4b49a] mt-6">
          © {new Date().getFullYear()} Birer Tekstil — Yetkisiz erişim yasaktır.
        </p>
      </div>
    </div>
  )
}
