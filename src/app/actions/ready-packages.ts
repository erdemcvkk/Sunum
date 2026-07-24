'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getReadyPackages() {
  try {
    return await prisma.readyPackage.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching ready packages:', error)
    return []
  }
}

export async function createReadyPackage(formData: FormData) {
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const price = (formData.get('price') as string) || '0'
  const badge = (formData.get('badge') as string) || 'Hazır Tasarım Seti'
  const imagesJson = (formData.get('imagesJson') as string) || '[]'

  if (!title) throw new Error('Paket başlığı zorunludur')

  const count = await prisma.readyPackage.count()

  const item = await prisma.readyPackage.create({
    data: {
      title,
      description,
      price,
      badge,
      imagesJson,
      order: count,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/ready-packages')

  return item
}

export async function updateReadyPackage(
  id: string,
  data: {
    title?: string
    description?: string
    price?: string
    badge?: string
    imagesJson?: string
    order?: number
  }
) {
  const item = await prisma.readyPackage.update({
    where: { id },
    data,
  })

  revalidatePath('/')
  revalidatePath('/admin/ready-packages')

  return item
}

export async function deleteReadyPackage(id: string) {
  await prisma.readyPackage.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/admin/ready-packages')
}
