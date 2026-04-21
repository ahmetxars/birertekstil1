import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Yönetici Girişi',
  description: 'Birer Tekstil yönetim paneline giriş yapın.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  if (await isAdminAuthenticated()) {
    redirect('/yonetim')
  }

  const { next } = await searchParams

  return <AdminLoginForm nextPath={next || '/yonetim'} />
}
