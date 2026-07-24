'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGalleryImages() {
  return await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  })
}

export async function createGalleryImage(formData: FormData) {
  const category = (formData.get('category') as string) || 'Genel'
  const imageUrl = formData.get('imageUrl') as string
  const title = formData.get('title') as string | null

  if (!imageUrl) {
    throw new Error('Görsel zorunludur')
  }

  const lastItem = await prisma.galleryImage.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const order = lastItem ? lastItem.order + 1 : 0

  await prisma.galleryImage.create({
    data: {
      category,
      imageUrl,
      title,
      order
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/gallery')
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({
    where: { id }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/gallery')
}

export async function getCategories() {
  const items = await prisma.galleryImage.findMany({
    select: { category: true },
    distinct: ['category']
  })
  return items.map(item => item.category)
}
