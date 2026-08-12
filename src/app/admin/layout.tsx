import { verifyAdmin } from '@/lib/auth'
import AdminShell from './components/AdminShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Paneli | Yönetim',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await verifyAdmin()
  
  return <AdminShell isAuth={isAuth}>{children}</AdminShell>
}
