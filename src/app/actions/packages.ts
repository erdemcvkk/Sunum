'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPackages() {
  return await prisma.package.findMany({
    orderBy: { order: 'asc' }
  })
}

export async function createPackage(formData: FormData) {
  const title = formData.get('title') as string
  const postCount = parseInt(formData.get('postCount') as string)
  const price = formData.get('price') as string
  const features = formData.get('features') as string
  const thumbnailImages = formData.get('thumbnailImages') as string
  const isPopular = formData.get('isPopular') === 'true'

  if (!title || isNaN(postCount) || !price) {
    throw new Error('Başlık, post sayısı ve fiyat zorunludur')
  }

  const lastItem = await prisma.package.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const order = lastItem ? lastItem.order + 1 : 0

  await prisma.package.create({
    data: {
      title,
      postCount,
      price,
      features: features || '[]',
      thumbnailImages: thumbnailImages || '[]',
      isPopular,
      order
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/packages')
}

export async function updatePackage(id: string, data: {title?: string, postCount?: number, price?: string, features?: string, thumbnailImages?: string, isPopular?: boolean}) {
  const updateData: any = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.postCount !== undefined) updateData.postCount = data.postCount
  if (data.price !== undefined) updateData.price = data.price
  if (data.features !== undefined) updateData.features = data.features
  if (data.thumbnailImages !== undefined) updateData.thumbnailImages = data.thumbnailImages
  if (data.isPopular !== undefined) updateData.isPopular = data.isPopular

  await prisma.package.update({
    where: { id },
    data: updateData
  })

  revalidatePath('/')
  revalidatePath('/admin/packages')
}

export async function deletePackage(id: string) {
  await prisma.package.delete({
    where: { id }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/packages')
}
