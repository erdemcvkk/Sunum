import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

// STRICTLY only the 4 original Marmara images
const marmaraImages = [
  '/tasarimlar/optimized/thumbs/marmara-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/08-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/10-06-2026-marmara-post.webp',
]

// STRICTLY only the 4 original Yaman images
const yamanImages = [
  '/tasarimlar/optimized/thumbs/yaman-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/13-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/20-07-2026-yaman-post.webp',
]

async function updatePortfolioData() {
  console.log('Seeding portfolio items with strictly 4 unique images for each brand...')

  await prisma.portfolioItem.deleteMany()

  // 1. Marmara Sürücü Kursu (Order 0)
  await prisma.portfolioItem.create({
    data: {
      clientName: 'Marmara Sürücü Kursu',
      username: 'marmarasurucukursu',
      category: 'Sürücü Kursu & Sürüş Eğitimi',
      bio: JSON.stringify([
        '🚗 Geleceğin Sürücülerini Yetiştiriyoruz',
        '🔑 A, B, C, CE Sınıfı Ehliyet Eğitimleri',
        '🏆 %98 İlk Sınavda Başarı Oranı',
        '📍 Tekirdağ / Merkez'
      ]),
      link: 'marmaraehliyet.com',
      postsCount: 142,
      followers: '4.850',
      following: 120,
      mockupImageUrl: '',
      imagesJson: JSON.stringify(marmaraImages),
      order: 0,
    }
  })

  // 2. Yaman Sürücü Kursu (Order 1)
  await prisma.portfolioItem.create({
    data: {
      clientName: 'Yaman Sürücü Kursu',
      username: 'yamansurucukursu',
      category: 'Sürücü Kursu & Eğitim Merkezi',
      bio: JSON.stringify([
        '⚡ Güvenli Sürüşün Doğru Adresi',
        '🏍️ A1, A2, A ve B Sınıfı Ehliyet',
        '🎯 Birebir Direksiyon Dersleri',
        '📍 Tekirdağ / Süleymanpaşa'
      ]),
      link: 'yamanehliyet.com',
      postsCount: 188,
      followers: '6.320',
      following: 95,
      mockupImageUrl: '',
      imagesJson: JSON.stringify(yamanImages),
      order: 1,
    }
  })

  console.log('✓ Successfully seeded Marmara and Yaman with strictly 4 unique designs!')
}

updatePortfolioData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
