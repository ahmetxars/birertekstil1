import AdminPanel from '@/components/admin/AdminPanel'
import { requireAdminUser } from '@/lib/auth'

export default async function AdminPage() {
  await requireAdminUser()

  return <AdminPanel />
}
