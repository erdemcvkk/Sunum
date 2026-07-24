import { prisma } from '@/lib/prisma'
import { Briefcase, Image as ImageIcon, Package } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [portfolioCount, galleryCount, packagesCount] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.galleryImage.count(),
    prisma.package.count(),
  ])

  const stats = [
    { name: 'Toplam Portfolyo', count: portfolioCount, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100', href: '/admin/portfolio' },
    { name: 'Galeri Görseli', count: galleryCount, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-100', href: '/admin/gallery' },
    { name: 'Aktif Paket', count: packagesCount, icon: Package, color: 'text-green-500', bg: 'bg-green-100', href: '/admin/packages' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fantas-dark">Dashboard</h1>
          <p className="mt-1 text-sm text-fantas-text-light">
            Yönetim paneline hoş geldiniz. İçeriklerinizi buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-fantas-border"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-fantas-text-light truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-fantas-dark">{item.count}</p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href={item.href} className="font-medium text-fantas-blue hover:text-blue-500">
                    Tümünü gör<span className="sr-only"> {item.name}</span>
                  </Link>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}
