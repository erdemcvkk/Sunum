'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  Package, 
  FileText, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  FolderOpen,
  Boxes,
  BarChart3
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Portfolyo', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Hazır Paket Tasarımlar', href: '/admin/ready-packages', icon: Boxes },
  { name: 'Galeri', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Ortam Kütüphanesi', href: '/admin/media', icon: FolderOpen },
  { name: 'Fiyat Paketleri', href: '/admin/packages', icon: Package },
  { name: 'İçerikler', href: '/admin/content', icon: FileText },
]

export default function AdminShell({ children, isAuth }: { children: React.ReactNode, isAuth: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuth && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (isAuth && pathname === '/admin/login') {
      router.push('/admin')
    }
  }, [isAuth, pathname, router])

  if (!isAuth && pathname !== '/admin/login') return null;

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-fantas-blue w-8 h-8 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">Yönetim Paneli</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-[260px] bg-gray-900 text-white flex flex-col z-50
        transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-5 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-fantas-blue w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold tracking-wide text-gray-200">YÖNETİM PANELİ</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-fantas-blue text-white shadow-lg shadow-blue-500/20' 
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-800/50">
          <button
            onClick={() => logoutAction()}
            className="flex items-center w-full gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 bg-gray-50 h-screen overflow-y-auto">
        <div className="flex-1 p-5 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
