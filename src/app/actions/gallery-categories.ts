'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGalleryCategories() {
  try {
    let cats = await prisma.galleryCategory.findMany({
      orderBy: { order: 'asc' }
    });

    // Eğer hiç kategori yoksa, varsayılan olarak "Sürücü Kursu" ekleyelim
    if (cats.length === 0) {
      const defaultCat = await prisma.galleryCategory.create({
        data: {
          name: 'Sürücü Kursu',
          order: 1
        }
      });
      cats = [defaultCat];
    }

    return cats;
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return [];
  }
}

export async function createGalleryCategory(name: string) {
  if (!name || name.trim() === '') {
    throw new Error('Kategori adı boş olamaz');
  }

  const trimmedName = name.trim();

  const existing = await prisma.galleryCategory.findUnique({
    where: { name: trimmedName }
  });

  if (existing) {
    throw new Error('Bu kategori zaten mevcut');
  }

  const lastItem = await prisma.galleryCategory.findFirst({
    orderBy: { order: 'desc' }
  });

  const order = lastItem ? lastItem.order + 1 : 1;

  await prisma.galleryCategory.create({
    data: {
      name: trimmedName,
      order
    }
  });

  revalidatePath('/');
  revalidatePath('/admin/gallery');
}

export async function deleteGalleryCategory(id: string) {
  // Kategoriyi sil
  await prisma.galleryCategory.delete({
    where: { id }
  });

  revalidatePath('/');
  revalidatePath('/admin/gallery');
}

export async function updateGalleryCategoriesOrder(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await prisma.galleryCategory.update({
      where: { id: ids[i] },
      data: { order: i + 1 }
    });
  }
  revalidatePath('/');
  revalidatePath('/admin/gallery');
}
