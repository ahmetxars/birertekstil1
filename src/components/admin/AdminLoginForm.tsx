'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface AdminLoginFormProps {
  nextPath: string
}

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_ADMIN_USERNAME_HINT || 'admin')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Giriş yapılamadı')
        return
      }

      toast.success('Giriş başarılı')
      router.push(nextPath)
      router.refresh()
    } catch {
      toast.error('Giriş sırasında bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f8f5f0]">
      <Card className="w-full max-w-md border-[#e8e0d4] shadow-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#a67c52]/10 flex items-center justify-center">
            <LockKeyhole className="h-6 w-6 text-[#a67c52]" />
          </div>
          <div>
            <CardTitle className="text-2xl text-[#3d2c1e]">Yönetici Girişi</CardTitle>
            <CardDescription className="text-[#8b7355]">
              Ürün ve içerik yönetimi için giriş yapın
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#3d2c1e]">
                Kullanıcı Adı
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#3d2c1e]">
                Şifre
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a67c52] hover:bg-[#a67c52]/90 text-white"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
