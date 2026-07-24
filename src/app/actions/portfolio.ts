'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPortfolioItems() {
  return await prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' }
  })
}

export async function createPortfolioItem(formData: FormData) {
  const clientName = formData.get('clientName') as string
  const username = (formData.get('username') as string) || ''
  const category = (formData.get('category') as string) || 'Sürücü Kursu'
  const bio = (formData.get('bio') as string) || '[]'
  const link = (formData.get('link') as string) || ''
  const postsCount = parseInt((formData.get('postsCount') as string) || '120', 10)
  const followers = (formData.get('followers') as string) || '2.500'
  const following = parseInt((formData.get('following') as string) || '75', 10)
  const mockupImageUrl = (formData.get('mockupImageUrl') as string) || ''
  const imagesJson = (formData.get('imagesJson') as string) || '[]'

  if (!clientName) {
    throw new Error('Müşteri/Marka adı zorunludur')
  }

  const lastItem = await prisma.portfolioItem.findFirst({
    orderBy: { order: 'desc' }
  })
  
  const order = lastItem ? lastItem.order + 1 : 0

  await prisma.portfolioItem.create({
    data: {
      clientName,
      username,
      category,
      bio,
      link,
      postsCount,
      followers,
      following,
      mockupImageUrl,
      imagesJson,
      order
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/portfolio')
}

export async function updatePortfolioItem(id: string, data: {
  clientName?: string
  username?: string
  category?: string
  bio?: string
  link?: string
  postsCount?: number
  followers?: string
  following?: number
  mockupImageUrl?: string
  imagesJson?: string
}) {
  await prisma.portfolioItem.update({
    where: { id },
    data
  })

  revalidatePath('/')
  revalidatePath('/admin/portfolio')
}

export async function deletePortfolioItem(id: string) {
  await prisma.portfolioItem.delete({
    where: { id }
  })
  
  revalidatePath('/')
  revalidatePath('/admin/portfolio')
}
