'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function getMediaItems() {
  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteMediaItem(id: string) {
  const media = await prisma.media.findUnique({ where: { id } })
  if (!media) return

  // Delete from filesystem - strip leading slash for correct path join
  const relativeUrl = media.url.startsWith('/') ? media.url.slice(1) : media.url
  const filePath = path.join(process.cwd(), 'public', relativeUrl)
  if (existsSync(filePath)) {
    try {
      await unlink(filePath)
    } catch (err) {
      console.error('File delete error:', err)
    }
  }

  await prisma.media.delete({ where: { id } })
  revalidatePath('/admin/media')
}
