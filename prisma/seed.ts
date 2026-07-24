import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.package.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.siteContent.deleteMany()

  // Seed Packages
  await prisma.package.createMany({
    data: [
      {
        title: 'BAŞLANGIÇ PAKETİ',
        postCount: 10,
        price: '₺1.999',
        features: JSON.stringify([
          '2 Story Tasarımı',
          '1 Revize Hakkı',
          'Standart Tasarım Desteği',
          '7 İş Günü İçerisinde Teslimat',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: false,
        order: 1,
      },
      {
        title: 'PROFESYONEL PAKET',
        postCount: 20,
        price: '₺3.499',
        features: JSON.stringify([
          '5 Story Tasarımı',
          'Reels Kapakları',
          '3 Revize Hakkı',
          'Özel Kampanya Tasarımları',
          '7 İş Günü İçerisinde Teslimat',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: true,
        order: 2,
      },
      {
        title: 'PREMIUM PAKET',
        postCount: 30,
        price: '₺5.999',
        features: JSON.stringify([
          '10 Story Tasarımı',
          'Reels Kapakları',
          'Sınırsız Revize Hakkı',
          'Özel Kampanya Tasarımları',
          'Öncelikli Teslimat (5 İş Günü)',
          'Aylık Strateji Danışmanlığı',
        ]),
        thumbnailImages: JSON.stringify([]),
        isPopular: false,
        order: 3,
      },
    ],
  })

  // Seed Portfolio Items
  await prisma.portfolioItem.createMany({
    data: [
      {
        clientName: 'Marmara Sürücü Kursu',
        mockupImageUrl: '/images/placeholder-mockup-1.svg',
        order: 1,
      },
      {
        clientName: 'Yaman Sürücü Kursu',
        mockupImageUrl: '/images/placeholder-mockup-2.svg',
        order: 2,
      },
      {
        clientName: 'Trakya Sürücü Kursu',
        mockupImageUrl: '/images/placeholder-mockup-3.svg',
        order: 3,
      },
    ],
  })

  // Seed Gallery Images
  const categories = [
    'Kampanya',
    'Kayıt Duyuruları',
    'Başarı Hikayeleri',
    'Tır & Kamyon',
    'Motosiklet',
    'Bayram',
    'Reels Kapakları',
  ]

  const galleryData = [
    { title: 'Ehliyet Almanın Doğru Yolu', category: 'Kampanya' },
    { title: 'Kampanya Zamanı! %30', category: 'Kampanya' },
    { title: 'Yolda Güven Hayat Kurtarır', category: 'Başarı Hikayeleri' },
    { title: 'Kayıtlarımız Devam Ediyor!', category: 'Kayıt Duyuruları' },
    { title: 'Tecrübe Kazan Güvenle Sür!', category: 'Başarı Hikayeleri' },
    { title: 'Dikkatli Sür Sevdiklerin Seni Bekler', category: 'Kampanya' },
    { title: 'Sınavda Değil Yolda Başarı!', category: 'Başarı Hikayeleri' },
    { title: 'Güvenli Sürüş Parlak Gelecek!', category: 'Kampanya' },
    { title: 'Tır & Kamyon Ehliyeti Başladı!', category: 'Tır & Kamyon' },
    { title: 'Motorunu Seç Yoluna Çık!', category: 'Motosiklet' },
    { title: 'Bayramımız Mübarek Olsun!', category: 'Bayram' },
    { title: 'Yeni Başlangıçlar İçin Doğru Adres!', category: 'Kayıt Duyuruları' },
  ]

  await prisma.galleryImage.createMany({
    data: galleryData.map((item, index) => ({
      title: item.title,
      category: item.category,
      imageUrl: `/images/gallery-placeholder-${index + 1}.svg`,
      order: index + 1,
    })),
  })

  // Seed Site Content
  await prisma.siteContent.createMany({
    data: [
      {
        sectionKey: 'hero_badge',
        textValue: 'SÜRÜCÜ KURSLARINA ÖZEL',
      },
      {
        sectionKey: 'hero_title',
        textValue: 'Sosyal Medya Tasarımı ile Fark Yaratın!',
      },
      {
        sectionKey: 'hero_subtitle',
        textValue:
          'Sürücü kursları için özel olarak hazırladığımız sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın.',
      },
      {
        sectionKey: 'hero_image',
        primaryImageUrl: '/images/hero-mockup.svg',
      },
      {
        sectionKey: 'cta_whatsapp',
        textValue: 'https://wa.me/905551234567',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
