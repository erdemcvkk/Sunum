import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const marmaraImages = [
  '/tasarimlar/optimized/thumbs/marmara-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/08-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/10-06-2026-marmara-post.webp',
]

const yamanImages = [
  '/tasarimlar/optimized/thumbs/yaman-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/13-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/20-07-2026-yaman-post.webp',
]

async function main() {
  console.log('Seeding ready package designs...')

  await prisma.readyPackage.deleteMany()

  await prisma.readyPackage.createMany({
    data: [
      {
        title: 'Premium Ehliyet Kayıt Dönemi Sosyal Medya Paketi',
        description: 'Sürücü kursları için özel hazırlanan, kayıt dönemlerinde dönüşümleri artıran 12 adet yüksek çözünürlüklü sosyal medya tasarım seti.',
        price: '1.499',
        badge: '⚡ Çok Satan Paket',
        imagesJson: JSON.stringify(marmaraImages),
        order: 1,
      },
      {
        title: 'Motosiklet & Özel Direksiyon Dersi Şablon Paketi',
        description: 'A1, A2, A Sınıfı motor ve B sınıfı birebir direksiyon eğitimlerini öne çıkaran hazır tasarım seti.',
        price: '1.299',
        badge: '🎯 Popüler Şablon',
        imagesJson: JSON.stringify(yamanImages),
        order: 2,
      },
    ],
  })

  console.log('Ready package designs seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
