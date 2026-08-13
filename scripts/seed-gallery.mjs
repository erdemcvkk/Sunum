import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const galleryImages = [
  {
    category: 'Kampanya',
    imageUrl: '/tasarimlar/optimized/gallery/06-07-2026-marmara-post.webp',
    title: 'Marmara Sürücü Kursu',
    order: 1,
  },
  {
    category: 'Kampanya',
    imageUrl: '/tasarimlar/optimized/gallery/06-07-2026-yaman-post.webp',
    title: 'Yaman Sürücü Kursu',
    order: 2,
  },
  {
    category: 'Kayıt Duyuruları',
    imageUrl: '/tasarimlar/optimized/gallery/08-07-2026-marmara-post.webp',
    title: 'Kayıtlar Başladı',
    order: 3,
  },
  {
    category: 'Kayıt Duyuruları',
    imageUrl: '/tasarimlar/optimized/gallery/10-06-2026-marmara-post.webp',
    title: 'Yeni Dönem Kayıtları',
    order: 4,
  },
  {
    category: 'Kampanya',
    imageUrl: '/tasarimlar/optimized/gallery/13-07-2026-yaman-post.webp',
    title: 'Kampanya Tasarımı',
    order: 5,
  },
  {
    category: 'Kampanya',
    imageUrl: '/tasarimlar/optimized/gallery/20-07-2026-yaman-post.webp',
    title: 'Güncel Kampanya',
    order: 6,
  },
  {
    category: 'Başarı Hikayeleri',
    imageUrl: '/tasarimlar/optimized/gallery/marmara-reklam-post.webp',
    title: 'Marmara Reklam Tasarımı',
    order: 7,
  },
  {
    category: 'Başarı Hikayeleri',
    imageUrl: '/tasarimlar/optimized/gallery/yaman-reklam-post.webp',
    title: 'Yaman Reklam Tasarımı',
    order: 8,
  },
];

async function main() {
  // Clear existing gallery images
  await prisma.galleryImage.deleteMany();
  console.log('Cleared existing gallery images.');

  // Insert new gallery images
  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
    console.log(`Added: ${img.title}`);
  }

  console.log(`\nDone! ${galleryImages.length} gallery images seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
